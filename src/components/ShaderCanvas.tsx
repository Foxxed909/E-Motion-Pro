"use client";

import { useEffect, useRef } from "react";

type Uniforms = Record<string, number | [number, number] | [number, number, number]>;

type Props = {
  /** Fragment shader body. Has access to: uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse (0..1, y up); uniform float u_hover. */
  frag: string;
  className?: string;
  /** Max device pixel ratio. Shaders are fill-rate bound; keep this modest. */
  dpr?: number;
  /** Extra uniforms read every frame (mutate the ref object to animate). */
  uniforms?: React.RefObject<Uniforms>;
  speed?: number;
  /** Upper bound on rendered pixels per frame; the canvas is upscaled by CSS beyond it.
      Keeps soft, full-screen shaders cheap on 4K/5K displays. */
  maxPixels?: number;
};

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;

const HEADER = `precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_hover;
`;

export function ShaderCanvas({ frag, className, dpr = 1.5, uniforms, speed = 1, maxPixels = 1_200_000 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // A fresh canvas per effect run, so releasing the context on cleanup is always safe.
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    ref.current!.appendChild(canvas);
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, alpha: true });
    if (!gl) return () => canvas.remove();

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s), src);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, HEADER + frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uHover = gl.getUniformLocation(prog, "u_hover");
    const extra = new Map<string, WebGLUniformLocation | null>();

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, h: 0, th: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
      mouse.th = mouse.tx >= 0 && mouse.tx <= 1 && mouse.ty >= 0 && mouse.ty <= 1 ? 1 : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      let ratio = Math.min(window.devicePixelRatio || 1, coarse ? Math.min(dpr, 1) : dpr);
      const area = canvas.clientWidth * canvas.clientHeight * ratio * ratio;
      if (area > maxPixels) ratio *= Math.sqrt(maxPixels / area);
      const w = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const h = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let t = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      t += dt * speed * (reduce ? 0.15 : 1);
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.h += (mouse.th - mouse.h) * 0.05;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, mouse.h);
      if (uniforms?.current) {
        for (const [k, v] of Object.entries(uniforms.current)) {
          if (!extra.has(k)) extra.set(k, gl.getUniformLocation(prog, k));
          const l = extra.get(k)!;
          if (typeof v === "number") gl.uniform1f(l, v);
          else if (v.length === 2) gl.uniform2f(l, v[0], v[1]);
          else gl.uniform3f(l, v[0], v[1], v[2]);
        }
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [frag, dpr, uniforms, speed, maxPixels]);

  return <div ref={ref} className={className ?? "absolute inset-0 h-full w-full"} />;
}

/** Shared GLSL helpers: hash, value noise, fbm, palette. */
export const GLSL_NOISE = `
float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
float fbm(vec2 p){ float v=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<6;i++){ v+=a*noise(p); p=m*p; a*=.5; } return v; }
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){ return a + b*cos(6.28318*(c*t+d)); }
`;

"use client";

import { ShaderCanvas } from "@/components/ShaderCanvas";

const FRAG = `
vec2 hash2(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); }
void main(){
  vec2 uv = (gl_FragCoord.xy - .5*u_res)/u_res.y;
  vec2 m = (u_mouse - .5)*vec2(u_res.x/u_res.y, 1.);
  // The pointer bulges the lattice like a thumb pressed into glass.
  vec2 d = uv - m;
  uv -= d * .35 * exp(-dot(d,d)*5.) * u_hover;
  vec2 p = uv*4.2;
  vec2 ip = floor(p), fp = fract(p);
  float d1 = 8., d2 = 8.; vec2 id = vec2(0.);
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec2 g = vec2(float(i), float(j));
    vec2 o = hash2(ip + g);
    o = .5 + .46*sin(u_time*.7 + 6.2831*o);
    float dist = length(g + o - fp);
    if(dist < d1){ d2 = d1; d1 = dist; id = ip + g; }
    else if(dist < d2){ d2 = dist; }
  }
  float edge = d2 - d1;
  vec2 h = hash2(id);
  // Each cell is a pane tinted from a four-colour palette.
  vec3 a = vec3(.48,.36,1.), b = vec3(.2,.88,1.), c = vec3(1.,.36,.66), e = vec3(.83,1.,.23);
  vec3 tint = h.x < .34 ? mix(a,b,h.y) : h.x < .67 ? mix(c,a,h.y) : mix(b,e,h.y*.6);
  float bevel = smoothstep(0., .22, edge);
  vec3 col = tint * (.22 + .78*bevel) * (.55 + .45*(1. - d1));
  // Specular streak across each pane, and dark leading between them.
  col += vec3(1.) * pow(max(0., 1. - abs(fract(d1*2.2 - u_time*.12 + h.y) - .5)*2.), 14.) * .22 * bevel;
  col = mix(vec3(.02,.02,.035), col, smoothstep(.0, .045, edge));
  col *= smoothstep(1.35, .2, length(uv*vec2(.75,1.)));
  gl_FragColor = vec4(col, 1.);
}`;

export default function VoronoiGlass() {
  return (
    <div className="absolute inset-0">
      <ShaderCanvas frag={FRAG} />
      <div className="pointer-events-none absolute bottom-[6cqh] left-[5cqw] font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.3em] text-ink/60">voronoi · F2 − F1</div>
    </div>
  );
}

"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/components/ShaderCanvas";

const FRAG = GLSL_NOISE + `
void main(){
  vec2 p = (gl_FragCoord.xy - .5*u_res)/u_res.y;
  float t = u_time*.09;
  vec2 m = (u_mouse - .5) * 1.2;
  vec2 q = vec2(fbm(p*1.4 + vec2(0., t)), fbm(p*1.4 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p*1.8 + 3.*q + vec2(1.7,9.2) + t*1.6 + m), fbm(p*1.8 + 3.*q + vec2(8.3,2.8) - t));
  float f = fbm(p*1.3 + 2.6*r);
  // curtains: stretch vertically
  float curtain = pow(fbm(vec2(p.x*3. + r.x*2., t*2.)), 2.) * smoothstep(-.6, .4, p.y + r.y*.6);
  vec3 col = vec3(.01,.008,.03);
  col = mix(col, vec3(.15,.85,.6), clamp(curtain*2.4, 0., 1.));
  col = mix(col, vec3(.48,.36,1.), clamp(f*f*1.7, 0., 1.)*.8);
  col = mix(col, vec3(1.,.36,.66), clamp(length(q)*.9 - .45, 0., 1.));
  col += vec3(.83,1.,.23) * pow(clamp(r.x,0.,1.), 6.) * .9;
  col *= smoothstep(1.3, .1, length(p*vec2(.8,1.)));
  col = pow(col, vec3(.85));
  gl_FragColor = vec4(col, 1.);
}`;

export default function Aurora() {
  return (
    <div className="absolute inset-0">
      <ShaderCanvas frag={FRAG} />
      <div className="pointer-events-none absolute bottom-[6cqh] left-[5cqw] font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.3em] text-ink/60">fbm ∘ fbm ∘ fbm — 69.6°N</div>
    </div>
  );
}

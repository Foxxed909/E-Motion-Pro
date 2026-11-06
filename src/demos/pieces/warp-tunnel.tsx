"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/components/ShaderCanvas";

const FRAG = GLSL_NOISE + `
void main(){
  vec2 p = (gl_FragCoord.xy - .5*u_res)/u_res.y;
  vec2 m = (u_mouse - .5)*.35;
  p -= m * (1. - length(p));
  float a = atan(p.y, p.x);
  float r = length(p);
  float t = u_time;
  vec2 uv = vec2(a/6.28318 + t*.02, .35/r + t*1.1);
  float gx = abs(fract(uv.x*12.) - .5);
  float gy = abs(fract(uv.y*1.5) - .5);
  float grid = smoothstep(.05, 0., gx) + smoothstep(.06, 0., gy)*.8;
  float streak = pow(noise(vec2(uv.x*60., uv.y*.6)), 12.)*3.;
  vec3 pal = palette(uv.y*.04 + a*.08, vec3(.5), vec3(.5), vec3(1.), vec3(.65,.35,.15));
  vec3 col = pal * (grid + streak);
  col *= smoothstep(.0, .35, r) * 1.4;
  col += vec3(.6,.4,1.) * .02/(r+.02);
  col = mix(col, vec3(0.), smoothstep(.9, 1.6, r));
  gl_FragColor = vec4(col, 1.);
}`;

export default function WarpTunnel() {
  return <ShaderCanvas frag={FRAG} />;
}

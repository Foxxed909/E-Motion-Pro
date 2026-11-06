"use client";

import { ShaderCanvas } from "@/components/ShaderCanvas";

const FRAG = `
void main(){
  float cell = max(8., u_res.y/42.);
  vec2 g = gl_FragCoord.xy;
  vec2 id = floor(g/cell);
  vec2 f = fract(g/cell) - .5;
  vec2 c = (id + .5)*cell/u_res.y;
  vec2 m = u_mouse*u_res/u_res.y;
  float d = length(c - m);
  float t = u_time;
  float w = sin(c.x*5. + c.y*3. - t*1.6)*.5 + .5;
  w = w*.7 + .3*(sin(length(c - vec2(.2,.3))*14. - t*2.4)*.5 + .5);
  w += sin(d*32. - t*7.)*exp(-d*4.)*u_hover*.6;
  float rad = mix(.04, .5, clamp(w, 0., 1.));
  float dotm = smoothstep(rad, rad - .09, length(f));
  vec3 a = vec3(.83,1.,.23), b = vec3(1.,.31,.18), cc = vec3(.48,.36,1.);
  vec3 col = mix(cc, mix(b, a, c.x/(u_res.x/u_res.y)), clamp(w*1.3, 0., 1.));
  gl_FragColor = vec4(col*dotm, 1.);
}`;

export default function HalftoneWave() {
  return <ShaderCanvas frag={FRAG} dpr={2} />;
}

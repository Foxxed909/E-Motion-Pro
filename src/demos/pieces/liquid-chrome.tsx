"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/components/ShaderCanvas";

const FRAG = GLSL_NOISE + `
float T;
float h(vec2 p){
  return fbm(p*1.6 + vec2(T, -T*.7)) + .45*sin(p.x*2.6 + T*1.3)*cos(p.y*2.2 - T);
}
vec3 env(vec3 r){
  float y = r.y;
  vec3 c = mix(vec3(.02,.02,.03), vec3(.95,.94,.98), smoothstep(-.25, .7, y));
  c += vec3(1.)*smoothstep(.035, 0., abs(y - .08))*.9;
  c += vec3(1.)*smoothstep(.02, 0., abs(y - .42))*.5;
  c = mix(c, c*vec3(.75,.85,1.25), smoothstep(.2, .9, y));
  c += palette(r.x*.6 + T*.2, vec3(.5), vec3(.5), vec3(1.), vec3(.0,.33,.67))*.18*smoothstep(-.1,.3,y);
  return c;
}
void main(){
  T = u_time*.35;
  vec2 p = (gl_FragCoord.xy - .5*u_res)/u_res.y;
  vec2 m = (u_mouse-.5)*vec2(u_res.x/u_res.y,1.);
  float bump = exp(-dot(p-m,p-m)*10.)*u_hover;
  vec2 e = vec2(.004, 0.);
  float c0 = h(p) + bump;
  float hx = h(p+e.xy) + exp(-dot(p+e.xy-m,p+e.xy-m)*10.)*u_hover - c0;
  float hy = h(p+e.yx) + exp(-dot(p+e.yx-m,p+e.yx-m)*10.)*u_hover - c0;
  vec3 n = normalize(vec3(-hx, -hy, e.x*1.6));
  vec3 r = reflect(vec3(0.,0.,-1.), n);
  vec3 col = env(r);
  col *= .55 + .45*n.z;
  col *= smoothstep(1.25, .25, length(p));
  gl_FragColor = vec4(pow(col, vec3(1.1)), 1.);
}`;

export default function LiquidChrome() {
  return <ShaderCanvas frag={FRAG} />;
}

"use client";

import { ShaderCanvas } from "@/components/ShaderCanvas";

const FRAG = `
float smin(float a, float b, float k){ float h = clamp(.5 + .5*(b-a)/k, 0., 1.); return mix(b, a, h) - k*h*(1.-h); }
float field(vec2 p){
  float t = u_time*.35;
  float d = 1e3;
  for (int i = 0; i < 7; i++){
    float fi = float(i);
    vec2 c = vec2(sin(t*(.6+fi*.13) + fi*2.1)*.55, sin(t*(.4+fi*.11) + fi*1.3)*.38);
    float r = .11 + .05*sin(fi*3.7 + t);
    d = smin(d, length(p - c) - r, .22);
  }
  vec2 m = (u_mouse - .5)*vec2(u_res.x/u_res.y, 1.);
  d = smin(d, length(p - m) - .09*u_hover, .25);
  d = smin(d, p.y + .5, .3);
  d = smin(d, -p.y + .5, .3);
  return d;
}
void main(){
  vec2 p = (gl_FragCoord.xy - .5*u_res)/u_res.y;
  float d = field(p);
  vec2 e = vec2(.002, 0.);
  vec3 n = normalize(vec3(field(p+e.xy)-field(p-e.xy), field(p+e.yx)-field(p-e.yx), .02));
  vec3 bg = mix(vec3(.05,.01,.06), vec3(.18,.03,.12), p.y + .5);
  vec3 wax = mix(vec3(1.,.31,.18), vec3(1.,.62,.26), clamp(.5 - p.y, 0., 1.));
  wax = mix(wax, vec3(1.,.36,.66), smoothstep(.1, -.4, p.y));
  float l = clamp(dot(n, normalize(vec3(-.4,.6,.7))), 0., 1.);
  float spec = pow(clamp(dot(reflect(-normalize(vec3(-.4,.6,.7)), n), vec3(0,0,1)), 0., 1.), 24.);
  vec3 col = wax*(.45 + .7*l) + spec*.8;
  float edge = smoothstep(.0, -.008, d);
  vec3 glow = wax*.35*exp(-max(d, 0.)*14.);
  gl_FragColor = vec4(mix(bg + glow, col, edge), 1.);
}`;

export default function LavaLamp() {
  return <ShaderCanvas frag={FRAG} />;
}

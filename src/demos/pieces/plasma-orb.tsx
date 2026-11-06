"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/components/ShaderCanvas";

const FRAG = GLSL_NOISE + `
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
void main(){
  vec2 p = (gl_FragCoord.xy - .5*u_res)/u_res.y;
  float t = u_time*.4;
  float R = .3 + .01*sin(t*3.);
  float r = length(p);
  vec3 col = vec3(0.);
  // outer tendrils
  float ang = atan(p.y,p.x);
  float tend = fbm(vec2(ang*2. + t, r*6. - t*3.));
  float halo = exp(-(r-R)*9.) * smoothstep(R-.01, R+.02, r);
  col += vec3(.48,.36,1.) * halo * (.6 + tend);
  col += vec3(1.,.36,.66) * pow(tend, 4.) * exp(-(r-R)*5.) * smoothstep(R, R+.05, r) * 1.5;
  if (r < R){
    float z = sqrt(R*R - r*r);
    vec3 n = normalize(vec3(p, z));
    vec3 q = n; q.xz *= rot(t*.7); q.yz *= rot(t*.4);
    float f = fbm(q.xy*3.5 + q.z*2. + t);
    float g = fbm(q.yz*4. - t*1.3 + f*2.);
    float veins = pow(1. - abs(g*2. - 1.), 10.);
    vec3 core = mix(vec3(.08,.02,.25), vec3(.2,.9,1.), f);
    core = mix(core, vec3(1.,.95,1.), veins);
    float rim = pow(1. - n.z, 2.5);
    col = core*(.4 + .6*n.z) + vec3(1.,.36,.66)*rim*1.4 + vec3(.83,1.,.23)*veins*.4;
  }
  col += vec3(.2,.1,.4) * .015/(abs(r-R)+.01) * .3;
  gl_FragColor = vec4(col, 1.);
}`;

export default function PlasmaOrb() {
  return <ShaderCanvas frag={FRAG} />;
}

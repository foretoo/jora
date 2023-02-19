import{Scene as ne,PerspectiveCamera as xe,WebGLRenderer as Me,OrthographicCamera as be,Mesh as $,PlaneBufferGeometry as re,ShaderMaterial as Se,WebGLRenderTarget as ae,NearestFilter as D,SphereBufferGeometry as ie,MeshStandardMaterial as P,InstancedMesh as B,Object3D as O,PointLight as Pe,Vector2 as se,PolyhedronGeometry as Fe,BufferGeometry as ze,BufferAttribute as q,Group as Ae,DoubleSide as Ie,CapsuleBufferGeometry as Le,Vector3 as Ce,Quaternion as De,PCFSoftShadowMap as Ge,Fog as Ue,AmbientLight as Te,DirectionalLight as _e,DirectionalLightHelper as $e,CameraHelper as Be,GridHelper as Oe}from"../vendors/three/three.module.js";import{O as qe}from"../vendors/three/OrbitControls.js";import{g as He}from"../vendors/three/lil-gui.module.min.js";import{p as Ne}from"../vendors/poisson-disk-sampling.js";import{c as Re}from"../vendors/simplex-noise.js";import"../vendors/moore.js";const We=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const h of n.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&i(h)}).observe(document,{childList:!0,subtree:!0});function r(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerpolicy&&(n.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?n.credentials="include":o.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=r(o);fetch(o.href,n)}};We();const ce=document.querySelector("canvas"),v=new ne;let T=innerWidth/innerHeight;const w=new xe(60,T,.1,100),te=document.querySelector("#logs"),H=new qe(w,ce);H.addEventListener("change",()=>{const{x:t,y:e,z:r}=w.position,{x:i,y:o,z:n}=w.rotation;te&&(te.innerHTML=`pos: (${t.toFixed(4)}, ${e.toFixed(4)}, ${r.toFixed(4)})
rot: (${i.toFixed(4)}, ${o.toFixed(4)}, ${n.toFixed(4)})
`)});const c=new Me({canvas:ce,antialias:!0});c.setSize(innerWidth,innerHeight);c.setPixelRatio(Math.min(window.devicePixelRatio,2));addEventListener("resize",()=>{T=innerWidth/innerHeight,w.aspect=T,w.updateProjectionMatrix(),c.setSize(innerWidth,innerHeight)});let b=!0;window.onkeydown=t=>{t.code==="Space"&&(t.preventDefault(),b?b=!1:(b=!0,de(le)))};let le;const de=t=>{le=t;const e=()=>{H.update(),c.render(v,w)};if(!t){const i=()=>{e(),b&&requestAnimationFrame(i)};requestAnimationFrame(i);return}const r=i=>{t(i),e(),b&&requestAnimationFrame(r)};requestAnimationFrame(r)};var Ee=`vec3 permute(vec3 x) { return mod(( (x*34.0) + 1.0 ) * x, 289.0 ); }

float snoise2D(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m*m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}`;const N=new ne,R=new be(-1,1,1,-1,0,1);R.position.z=1;const Ve=`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`,ke=Math.random()*10;let me=(t=!1)=>`
varying vec2 vUv;
const float PI = 3.14159265;

#include snoise2D;

void main() {
  float noise = snoise2D(vUv * 3.0 + ${ke}) * 0.5 + 0.5;
  noise *= noise * noise;
  float center = abs(sin(vUv.y * PI)) * abs(sin(vUv.x * PI));
  center *= center;
  float bottom = cos(vUv.y * PI * 0.5 + PI * 0.333);

  float value = 1.0 - center * 2.0 - bottom * 1.0 - noise * 1.6;
  value = clamp(value, 0.0, 1.0);
${t?"":`
  float red = 0.7 + 0.3 * value;
  float blue = 0.3 + 0.7 * value;
  float green = 0.2 + 0.8 * smoothstep(0.0, 1.0, value);
`}
  vec3 color = vec3(${t?"value":"red, green, blue"});
  gl_FragColor = vec4(color, 1.0);
}`.replace("#include snoise2D;",Ee);const W=new $(new re(2,2),new Se({vertexShader:Ve,fragmentShader:me()}));N.add(W);const g=256,pe=new ae(g,g,{magFilter:D,minFilter:D,depthBuffer:!1}),E=new ae(g,g,{magFilter:D,minFilter:D,depthBuffer:!1});c.setRenderTarget(pe);c.render(N,R);c.setRenderTarget(E);W.material.fragmentShader=me(!0);W.material.needsUpdate=!0;c.render(N,R);c.setRenderTarget(null);const V=new Uint8Array(g*g*4);c.readRenderTargetPixels(E,0,0,g,g,V);const je=pe.texture,Je=E.texture,Qe=.1,x=Math.sqrt(V.length/4),ue=(t,e)=>{const r=Math.floor(t),i=Math.floor(e),o=(i*x+r)*4;return V[o]/255};let oe=20;const fe=()=>{try{oe--;const t=new Ne({shape:[x,x],minDistance:x/16,maxDistance:x/2,tries:40,distanceFunction:e=>{const r=ue(e[0],e[1]);return r>.3?0:1-r}}).fill();if((t==null?void 0:t.length)<40)throw void 0;return t}catch{return oe?fe():void 0}},S=fe(),he=(S==null?void 0:S.length)||0,Ke=new ie(Qe,3,1,0,Math.PI*2,0,Math.PI/2),k=new P;k.onBeforeCompile=t=>{t.vertexShader=`varying vec3 vPosition;
`+t.vertexShader.replace(/#ifdef USE_TRANSMISSION|#endif/g,"").replace("#include <begin_vertex>","vPosition = vec3( position ); vec3 transformed = vec3( position );"),t.fragmentShader=t.fragmentShader.replace("varying vec3 vViewPosition;","varying vec3 vViewPosition; varying vec3 vWorldPosition; varying vec3 vPosition;").replace("#include <color_fragment>",`
      float py = vPosition.y * 10.0;
      vec3 wp = vWorldPosition;
      float v = smoothstep(0.0, 1.0, 0.3 + wp.y / 2.5 * 0.7);

      diffuseColor.rgb = vec3(1.0 - (1.0 - v) * py, (v + py) * 0.5, py);
      `)};k.needsUpdate=!0;const F=new B(Ke,k,he);F.material.flatShading=!0;F.castShadow=!0;F.receiveShadow=!0;const M=new O;for(let t=0;t<he;t++){const e=S[t][0],r=S[t][1],i=e/x*10-5,o=5-r/x*10;M.position.set(i,-.1,o);const n=Math.max(ue(e,r),.25),h=1+n*Math.random()*9,l=n*h*3;M.position.y+=n*n*.8,M.scale.set(h,l,h),M.rotation.set(Math.random()/3,Math.random()*Math.PI,0),M.updateMatrix(),F.setMatrixAt(t,M.matrix)}const Ye=()=>{v.add(F)},ve=4,Xe=new ie(.03,6,4),Ze=new P({emissive:"#5ff",emissiveIntensity:1}),j=new B(Xe,Ze,ve),L=new O;v.add(j);const et=Re(),tt=Array(ve).fill(null).map((t,e)=>{const r=Math.random()*Math.PI*2,i=.001+Math.random()*.002,o=Math.sign(Math.random()-.5),n=1.4+Math.random()*3.3,h="#fff",l=new Pe(h,1,3);l.castShadow=!0,l.shadow.mapSize=new se(128,128),l.shadow.camera.near=.1,l.shadow.camera.far=3,l.shadow.bias=3e-5,l.shadow.normalBias=.05,v.add(l);let A=0;return{update:()=>{const ee=et(A+r,0),I=n+n*ee/2,ye=n/I;L.position.set(Math.cos(r+A*o*Math.PI*2)*I,2+ee*1.5,Math.sin(r+A*o*Math.PI*2)*I),A+=i*ye,l.position.copy(L.position),l.intensity=I/3,L.updateMatrix(),j.setMatrixAt(e,L.matrix)}}}),ot=()=>{tt.forEach(t=>t.update()),j.instanceMatrix.needsUpdate=!0},nt=[0,0,-1,1,0,0,0,0,1,-1,0,0,0,1,0],rt=[1,0,4,2,1,4,3,2,4,0,3,4],G=new Fe(nt,rt,1.5,2),a=G.attributes.position.array,d=G.attributes.normal.array,m=G.attributes.uv.array,at=G.attributes.position.count,it=at/3;let p=new Float32Array(a.length),u=new Float32Array(d.length),f=new Float32Array(m.length),C=[],J=[];for(let t=0;t<it;t++){if(t===9||t===22)continue;const e=t*9;p[e+0]=a[e+0],p[e+1]=a[e+1],p[e+2]=a[e+2],p[e+3]=a[e+3],p[e+4]=a[e+4],p[e+5]=a[e+5],p[e+6]=a[e+6],p[e+7]=a[e+7],p[e+8]=a[e+8],u[e+0]=d[e+0],u[e+1]=d[e+1],u[e+2]=d[e+2],u[e+3]=d[e+3],u[e+4]=d[e+4],u[e+5]=d[e+5],u[e+6]=d[e+6],u[e+7]=d[e+7],u[e+8]=d[e+8],f[e+0]=m[e+0],f[e+1]=m[e+1],f[e+2]=m[e+2],f[e+3]=m[e+3],f[e+4]=m[e+4],f[e+5]=m[e+5],f[e+6]=m[e+6],f[e+7]=m[e+7],f[e+8]=m[e+8],C.push([a[e+0],a[e+1],a[e+2]]),C.push([a[e+3],a[e+4],a[e+5]]),C.push([a[e+6],a[e+7],a[e+8]])}const U=new ze;U.setAttribute("position",new q(p,3,!1));U.setAttribute("normal",new q(u,3,!1));U.setAttribute("uv",new q(f,3,!1));let st=new Set(C.map(JSON.stringify));J=Array.from(st).map(JSON.parse);const Q=new Ae,z=new $(U,new P({color:"#7fb"}));z.material.side=Ie;z.material.flatShading=!0;z.castShadow=!0;z.receiveShadow=!0;Q.add(z);const ct=new Le(.06,.04,3,8),we=new P({emissive:"#5ff"});we.emissiveIntensity=1;const K=new B(ct,we,J.length),y=new O,lt=new Ce(0,1,0),dt=new De;J.forEach(([t,e,r],i)=>{y.position.set(t,e||.01,r),y.position.multiplyScalar(1.02),y.quaternion.setFromUnitVectors(lt,y.position.clone().normalize()),e||y.quaternion.rotateTowards(dt,Math.PI*.375),y.updateMatrix(),K.setMatrixAt(i,y.matrix)});K.castShadow=!0;Q.add(K);const mt=()=>{v.add(Q)},pt=new He;w.position.set(2,5,8);c.shadowMap.enabled=!0;c.shadowMap.type=Ge;mt();Ye();const Y=new $(new re(10,10,64,64),new P({color:"#adf",map:je,displacementMap:Je,displacementScale:.8}));Y.rotation.x=-Math.PI/2;Y.receiveShadow=!0;v.add(Y);const _=new Ue("#b74",5,15);v.fog=_;H.addEventListener("change",()=>{const t=w.position.length();_.near=t-5,_.far=t+5});const ge=new Te(16777215,.1);v.add(ge);const s=new _e("#fa7",.9);s.position.set(7,4,2);s.castShadow=!0;s.shadow.bias=3e-5;s.shadow.mapSize=new se(1024,1024);s.shadow.normalBias=.05;const X=new $e(s,.2);setTimeout(()=>X.update(),0);X.visible=!1;const Z=new Be(s.shadow.camera);s.shadow.camera.near=2;s.shadow.camera.far=15;s.shadow.camera.left=-8;s.shadow.camera.right=8;s.shadow.camera.top=5;s.shadow.camera.bottom=-4;s.shadow.camera.updateProjectionMatrix();setTimeout(()=>Z.update(),0);Z.visible=!1;v.add(s,X,Z);const ut=new Oe(100,100,4473924,2236962);ut.position.y=.001;const ft=()=>{ot()};pt.add(ge,"intensity").min(0).max(1).step(.001).name("ambient");de(ft);

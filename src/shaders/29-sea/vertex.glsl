#define PI  3.1415926536
#define TAU 6.2831853072

uniform float uTime;
uniform float uElevation;
uniform vec2  uFrequency;

varying float h;

#include snoise;

void main() {
  vec3 p = position;
  float nm = 0.05; // noise multiplier

  p.y = sin(p.x * PI * uFrequency.x + uTime) * sin(p.z * PI * uFrequency.y + uTime * 0.333) * uElevation;


  float height = p.y / uElevation * 0.5 + 0.5;

  vec2 po = vec2(3.533, 9.576);
  
  float noise1 = abs(snoise(vec3( po + p.xz *  5.0, uTime * 0.5)) * nm      ) * (0.200 + 0.800 * height);
  float noise2 = abs(snoise(vec3( po + p.zx * 10.0, uTime * 0.5)) * nm / 2.0) * (0.333 + 0.667 * height);
  float noise3 = abs(snoise(vec3(-po + p.xz * 15.0, uTime * 0.5)) * nm / 3.0) * height;
  
  p.y -= noise1 + noise2 + noise3;
  h = p.y / (uElevation + nm) * 0.5 + 0.5;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0);
}
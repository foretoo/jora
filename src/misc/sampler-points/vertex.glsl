varying vec3 vPos;
varying float vNoise;
uniform float time;

#include snoise;
  
float PI = 3.14159265;

void main() {

  float bt = time / 16.0;
  float st = time / 12.0;
  
  // CLOUDS NOISE
  vec3 bp = position * vec3(0.33, 1.0, 0.33) * 2.1;
  vec3 sp = position * vec3(0.25, 1.0, 0.25) * 5.5;

  float bn = // 0.0;
    snoise(vec4(
      cos(bt) * bp.x - sin(bt) * bp.z,
      bp.y + bt,
      sin(bt) * bp.x + cos(bt) * bp.z,
      0.0
    )) + 1.0;
  float sn = // 0.0;
    snoise(vec4(
      cos(st) * sp.x - sin(st) * sp.z,
      sp.y + st,
      sin(st) * sp.x + cos(st) * sp.z,
      0.0
    )) + 1.0;


  // Get (0-1) final noise
  float n = (sn + bn) * 0.25;
  // Clear poles
  n = n - abs(sin(position.y * 0.4));
  // Extract clouds
  n = step(0.47, n);
  // if cloud go to an orbit
  vPos = (1.0 - n) * position + n * normalize(position) * 1.05;
  vNoise = n;

  vec4 mvPosition = modelViewMatrix * vec4(vPos, 1.0);
  gl_PointSize = 0.01 * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
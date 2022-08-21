uniform float time;
varying vec3 vPos;
varying float vNoise;

float PI = 3.14159265;

void main() {

  float t = time / 5.0;
  float ty = (vPos.y - t) * 3.33;

  float R = (sin(ty            ) + 1.0) / 2.0 + vNoise;
  float G = (sin(ty + PI * 0.67) + 1.0) / 3.0 + vNoise;
  float B = (sin(ty + PI * 1.33) + 1.0) / 2.5 + vNoise;

  gl_FragColor = vec4(R, G, B, 1.0);

}
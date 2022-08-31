attribute vec2 reference;

uniform float time;
uniform float noiseScale;
uniform float noiseStrength;
uniform sampler2D positionTexture;

#include cnoise;

void main() {
  gl_PointSize = 2.0;

  vec3 pos = texture(positionTexture, reference).xyz;
  vec3 cpos = cnoise(pos * noiseScale + time * 0.2) * noiseStrength;
  pos = mix(pos, cpos, 0.9);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
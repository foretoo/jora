attribute vec2 reference;

uniform float time;
uniform float noiseFactor;
uniform sampler2D positionTexture;

#include snoise;

void main() {
  gl_PointSize = 2.0;

  vec3 position = texture(positionTexture, reference).xyz;
  position = position + position * snoise(vec4(position, time)) * noiseFactor;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
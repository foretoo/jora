attribute vec2 reference;
uniform sampler2D positionTexture;

void main() {
  gl_PointSize = 1.0;

  vec3 newPosition = texture(positionTexture, reference).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
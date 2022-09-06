attribute vec2 ref;
uniform sampler2D positionTexture;

void main() {
  vec4 pos = texture2D(positionTexture, ref);
  vec4 mvPosition = modelViewMatrix * pos;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 7.1 / - mvPosition.z;
}
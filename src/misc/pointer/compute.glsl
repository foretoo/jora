uniform sampler2D positionTexture;
uniform vec2 pointer;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 position = texture(positionTexture, uv);

  position.x += pointer.x * 0.002;
  position.y += pointer.y * 0.002;

  gl_FragColor = position;
}
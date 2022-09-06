uniform sampler2D positionTexture;

void main() {
  vec2 ref = gl_FragCoord.xy / resolution.xy;
  vec4 prev = texture(positionTexture, ref);

  vec4 next = prev + 0.001;

  gl_FragColor = next;
}
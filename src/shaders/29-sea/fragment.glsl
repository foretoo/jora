varying float h;

void main() {
  float sh = sqrt(h);
  vec4 color = vec4(h * sh, sh, 1.0, 1.0);
  color = smoothstep(0.0, 1.0, color);
  gl_FragColor = color;
}
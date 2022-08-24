uniform float time;
uniform float vel;
uniform float roughness;
uniform sampler2D positionTexture;

float random (vec2 st) {
  return fract( sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123 );
}

float b = 0.208186;

void main() {
  vec2 reference = gl_FragCoord.xy / resolution.xy;
  vec3 prev = texture(positionTexture, reference).xyz;

  vec3 next = vec3(
    prev.x + vel * (sin(prev.y) - b * prev.x),
    prev.y + vel * (sin(prev.z) - b * prev.y),
    prev.z + vel * (sin(prev.x) - b * prev.z)
  );

  // Randomly add randomness
  float rnd = random(reference + time);
  float ifSo = step(0.99 + (1.0 - roughness) * 0.0099, rnd);
  next = next * (1.0 + ifSo * roughness * 0.1);

  gl_FragColor = vec4(next, 1.0);
}
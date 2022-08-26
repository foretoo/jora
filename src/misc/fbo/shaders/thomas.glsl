uniform float vel;
uniform float roughness;
uniform float tb;
uniform sampler2D positionTexture;

float random (vec2 st) {
  return fract( sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123 );
}

float rgh (vec2 st) {
  return roughness * 0.05 * sign(random(st) - 0.5);
}

void main() {
  vec2 reference = gl_FragCoord.xy / resolution.xy;
  vec4 prev = texture(positionTexture, reference);

  float v = vel / 50.0;

  vec3 next = vec3(
    prev.x + v * (sin(prev.y) - tb * prev.x) + rgh(prev.xy),
    prev.y + v * (sin(prev.z) - tb * prev.y) + rgh(prev.yz),
    prev.z + v * (sin(prev.x) - tb * prev.z) + rgh(prev.zx)
  );

  gl_FragColor = vec4(next, 1.0);
}
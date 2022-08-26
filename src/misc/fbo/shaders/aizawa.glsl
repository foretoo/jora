uniform float vel;
uniform float roughness;

uniform float aa;
uniform float ab;
uniform float ac;
uniform float ad;
uniform float ae;
uniform float af;

uniform sampler2D positionTexture;

float random (vec2 st) {
  return fract( sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123 );
}

float rgh (vec2 st) {
  return roughness * 0.05 * sign(random(st) - 0.5);
}

// float a =  1.00; // height of torus
// float b =  0.50; // attract to polars >1 top, <0 bottom
// float c =  1.50; // attratct to torus
// float d =  0.01; // rotating by Y
// float e =  0.15; // more tiny torus
// float f =  0.00; // skew -> mobius ribbon

void main() {
  vec2 reference = gl_FragCoord.xy / resolution.xy;
  vec4 prev = texture(positionTexture, reference);
  float x = prev.x;
  float y = prev.y;
  float z = prev.z;
  float v = vel / 100.0;

  vec3 next = vec3(
    x + v * ((z - ab) * x - ad * y) + rgh(prev.xy),
    y + v * (ad * x + (z - ab) * y) + rgh(prev.yz),
    z + v * (ac + aa * z - z * z * z / 3.0 - (x * x + y * y) * (1.0 + ae * z) + af * z * x * x * x) + rgh(prev.zx)
  );

  gl_FragColor = vec4(next, 1.0);
}
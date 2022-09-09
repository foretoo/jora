uniform sampler2D initialPositionTexture;
uniform sampler2D currentPositionTexture;
uniform sampler2D velocityTexture;
uniform vec4 pointer;

const float PI  = 3.14159265359;
const float PHI = 0.61803398875;
const float LEN = PHI * PI;



void main() {

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 initialPosition = texture(initialPositionTexture, uv).xyz;
  vec3 currentPosition = texture(currentPositionTexture, uv).xyz;
  vec3 velocity = texture(velocityTexture, uv).xyz;



  vec3 diff = currentPosition - pointer.xyz;
  float dlen = length(diff);
  float force = dlen < LEN
    ? cos((dlen / LEN) * PI) * 0.5 + 0.5
    : 0.0;
  force *= min(tan(force * PI / 2.0) * force, 55.0) / 55.0;
  force *= pointer.w * 0.05;

  // push from pointer
  velocity += normalize(diff) * force;

  // damp velocity of pushing away
  velocity *= 0.94;

  // pull back to initiate position
  diff = initialPosition - currentPosition;
  velocity += diff * 0.01;



  gl_FragColor = vec4(velocity, 1.0);
}
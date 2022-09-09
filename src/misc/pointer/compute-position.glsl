uniform sampler2D currentPositionTexture;
uniform sampler2D velocityTexture;



void main() {

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 position = texture(currentPositionTexture, uv);
  vec4 velocity = texture(velocityTexture, uv);



  position.x += velocity.x;
  position.y += velocity.y;
  position.z += velocity.z;



  gl_FragColor = position;
}
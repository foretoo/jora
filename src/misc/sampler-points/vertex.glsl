varying vec3 vColor;

void main() {

  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_PointSize = 0.02 * (300.0 / -mvPosition.z);

  gl_Position = projectionMatrix * mvPosition;

  vColor = vec3(position.xyz);

}
uniform float time;
varying vec3 vColor;

void main() {

  float PI = 3.14159265;
  float y = vColor.y * 5.0 + time;

  float R = (sin(y             ) + 1.0) / 2.0;
  float G = (sin(y + PI * 0.667) + 1.0) / 2.0;
  float B = (sin(y + PI * 1.333) + 1.0) / 2.0;


  gl_FragColor = vec4(R, G, B, 1.0 );

}
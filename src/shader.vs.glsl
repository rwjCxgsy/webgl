attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 projection;

uniform vec2 u_resolution;

varying vec2 v_texCoord;

void main () {
  vec2 zeroToOne = a_position.xy / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = projection * a_position;
  v_texCoord = a_texCoord;
}


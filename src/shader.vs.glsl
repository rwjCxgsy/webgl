  attribute vec4 a_position;
  attribute vec3 a_normal;
  uniform mat4 u_projection;
  uniform mat4 u_inverse;

  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  varying vec3 v_normal;
  void main() {
    gl_Position = u_projection * u_inverse * a_position;
    v_texCoord = a_texCoord;
    v_normal = a_normal;
  }
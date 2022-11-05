export const vertexString = `
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
  
`;
export const fragmentString = `

  precision mediump float;
  uniform sampler2D u_image;
  uniform vec2 u_textureSize;
  varying vec2 v_texCoord;


  varying vec3 v_normal;

  void main(){
    vec3 lightPosition = vec3(0.5, 0.7, 1.0);
    vec3 normal = normalize(v_normal);
    float light = dot(lightPosition, normal);
    gl_FragColor = vec4(0.2, 1, 0.2, 1.0);
    gl_FragColor.rgb *= light;

  }
`;

  precision mediump float;
  uniform vec4 u_color;

  // our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = texture2D(u_image, v_texCoord); // return redish-purple
  }

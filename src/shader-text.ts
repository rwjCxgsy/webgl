const vertexShader: string = /*vert*/ `

attribute vec4 a_position;
void main () {
  gl_Position = a_position;
}
`;

const fragmentShader: string = `
#version 460 core

#pragma vscode_glsllint_stage : frag //pragma to set STAGE to 'frag'

out vec4 FragColor;

in vec4 color;

void main(void) {
  FragColor = color;
}
`;

export { vertexShader, fragmentShader };

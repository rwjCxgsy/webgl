import { Matrix4, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from './OrbitControls';
import { positions, normals } from './geometry';
import './style.css';
import fragmentString from './shader.fs.glsl?raw';
import vertexString from './shader.vs.glsl?raw';

console.log(positions.length / 3);
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const FULLWIDTH = WIDTH * window.devicePixelRatio;
const FULLHEIGHT = HEIGHT * window.devicePixelRatio;

type GL = WebGLRenderingContext;

function createShader(gl: GL, type: number, content: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, content);
  gl.compileShader(shader);
  console.log(gl.getShaderParameter(shader, gl.COMPILE_STATUS));
  return shader;
}

function createProgram(gl: GL, vs: WebGLShader, fs: WebGLShader) {
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  console.log(gl.getProgramParameter(program, gl.LINK_STATUS));
  return program;
}

function initCanvas(canvas: HTMLCanvasElement) {
  canvas.width = FULLWIDTH;
  canvas.height = FULLHEIGHT;

  canvas.style.width = WIDTH + 'px';
  canvas.style.height = HEIGHT + 'px';

  document.body.append(canvas);
}

const canvas = document.createElement('canvas');
initCanvas(canvas);

const gl = canvas.getContext('webgl')!;

const vertex = createShader(gl, gl?.VERTEX_SHADER, vertexString);
const fragment = createShader(gl, gl?.FRAGMENT_SHADER, fragmentString);
const program = createProgram(gl, vertex, fragment);

const aPosition = gl.getAttribLocation(program, 'a_position');
const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
const projection = gl.getUniformLocation(program, 'u_projection');
const inverse = gl.getUniformLocation(program, 'u_inverse');
const textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize');
const normalLocation = gl.getAttribLocation(program, 'a_normal');

console.log(aPosition, projection, inverse);

const camera = new PerspectiveCamera(75, FULLWIDTH / FULLHEIGHT, 0.01, 2000);

camera.position.set(0, 0, 300);
camera.up.set(0, 0, 1);

console.log(camera.projectionMatrix);

const control = new OrbitControls(camera, canvas);

// 顶点坐标
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

// 纹理坐标
const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
  ]),
  gl.STATIC_DRAW
);

// 法向量
const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

var image = new Image();
image.crossOrigin = 'crossOrigin';
image.src = 'https://webglfundamentals.org/webgl/resources/leaves.jpg'; // MUST BE SAME DOMAIN!!!
image.onload = function () {
  requestAnimationFrame(render);
};

function render() {
  requestAnimationFrame(render);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  gl.uniform2f(textureSizeLocation, image.width, image.height);

  // gl.enableVertexAttribArray(texCoordLocation);
  // gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  // gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 设置参数，让我们可以绘制任何尺寸的图像
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // 将图像上传到纹理
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  {
    // 顶点赋值
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  }

  {
    // 法向量 赋值
    gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
  }

  {
    gl.uniformMatrix4fv(projection, false, camera.projectionMatrix.elements);
    gl.uniformMatrix4fv(inverse, false, camera.matrixWorldInverse.elements);
  }

  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);
}

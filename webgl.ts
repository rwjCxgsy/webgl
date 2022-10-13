import { createProgram, createShader } from './units';
import { mat4, vec3, vec4 } from 'gl-matrix';
import { Matrix4, Vector3, Vector4, OrthographicCamera } from 'three';
import fragmentShader from './shader.fs.glsl?raw';
import vertexShader from './shader.vs.glsl?raw';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function render(image: HTMLImageElement) {
  const canvas = document.createElement('canvas');

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const FULLWIDTH = WIDTH * window.devicePixelRatio;
  const FULLHEIGHT = HEIGHT * window.devicePixelRatio;

  canvas.width = FULLWIDTH;
  canvas.height = FULLHEIGHT;

  canvas.style.width = WIDTH + 'px';
  canvas.style.height = HEIGHT + 'px';

  document.body.append(canvas);

  const gl = canvas.getContext('webgl')!;

  const shaderVertex = createShader(gl, gl?.VERTEX_SHADER, vertexShader)!;
  const shaderFragment = createShader(gl, gl?.FRAGMENT_SHADER, fragmentShader)!;

  const program = createProgram(gl, shaderVertex, shaderFragment)!;

  const a_position = gl.getAttribLocation(program, 'a_position');
  const u_resolution = gl.getUniformLocation(program, 'u_resolution');
  const u_projection = gl.getUniformLocation(program, 'projection');
  var colorUniformLocation = gl.getUniformLocation(program, 'u_color');

  {
    // 找到纹理的地址
    var texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

    // 给矩形提供纹理坐标
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0.5, 0.5, 1.0, 0.0, 1.0, 1.0]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // 创建纹理
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

  gl.viewport(0, 0, FULLWIDTH, FULLHEIGHT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.useProgram(program);
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(u_resolution, FULLWIDTH, FULLHEIGHT);

  const camera = new OrthographicCamera(
    FULLWIDTH / -2,
    FULLWIDTH / 2,
    FULLHEIGHT / 2,
    FULLHEIGHT / -2,
    0.01,
    1000
  );

  const control = new OrbitControls(camera, canvas);

  control.addEventListener('change', (e) => {
    console.log(e.target.object);
  });

  gl.uniformMatrix4fv(u_projection, false, camera.projectionMatrix.elements);

  // 绘制50个随机颜色矩形
  for (var ii = 0; ii < 1; ++ii) {
    // 创建一个随机矩形
    // 并将写入位置缓冲
    // 因为位置缓冲是我们绑定在
    // `ARRAY_BUFFER`绑定点上的最后一个缓冲
    setRectangle(gl, 0, 0, 1000, 300);

    // 设置一个随机颜色
    gl.uniform4f(
      colorUniformLocation,
      Math.random(),
      Math.random(),
      Math.random(),
      1
    );

    // 绘制矩形
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function randomInt(range: number) {
    return Math.floor(Math.random() * range);
  }

  // 用参数生成矩形顶点并写进缓冲

  function setRectangle(
    gl: WebGLRenderingContext,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    // 注意: gl.bufferData(gl.ARRAY_BUFFER, ...) 将会影响到
    // 当前绑定点`ARRAY_BUFFER`的绑定缓冲
    // 目前我们只有一个缓冲，如果我们有多个缓冲
    // 我们需要先将所需缓冲绑定到`ARRAY_BUFFER`

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2]),
      gl.STATIC_DRAW
    );
  }
}

function main() {
  var image = new Image();
  image.crossOrigin = 'crossOrigin';
  image.src = 'https://webglfundamentals.org/webgl/resources/leaves.jpg'; // MUST BE SAME DOMAIN!!!
  image.onload = function () {
    render(image);
  };
}

main();

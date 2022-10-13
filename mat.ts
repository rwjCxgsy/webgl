import { Matrix3 } from 'three';

const canvas = document.createElement('canvas');
// const ctx = canvas.getContext('webgl');

const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;

canvas.width = width;
canvas.height = height;
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';
document.body.append(canvas);
const ctx = canvas.getContext('2d');

ctx?.clearRect(0, 0, 10000, 5000);

ctx?.setTransform(1, 0, 0, 1, width / 2, height / 2);
for (let i = 0; i < 200; i++) {
  ctx?.beginPath();
  ctx?.moveTo(i * 30 - width / 2, -height / 2);
  ctx?.lineTo(i * 30 - width / 2, height / 2);

  ctx?.stroke();
}

for (let i = 0; i < 200; i++) {
  ctx?.beginPath();
  ctx?.moveTo(-width / 2, i * 30 - height / 2);
  ctx?.lineTo(width / 2, i * 30 - height / 2);

  ctx?.stroke();
}

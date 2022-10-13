import * as THREE from 'three';
import { OrbitControls } from 'THREE/examples/jsm/controls/OrbitControls';
const scene = new THREE.Scene();
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.OrthographicCamera(
  width / -2,
  width / 2,
  height / 2,
  height / -2,
  1,
  50000
);

const v3 = new THREE.Vector3();
v3.applyMatrix4(camera.projectionMatrix.clone());
v3.applyMatrix4(camera.projectionMatrixInverse.clone());
console.log(v3);

camera.position.set(20, 20, 20);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const g = new THREE.BufferGeometry();
g.setAttribute(
  'position',
  new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3)
);
const Point = new THREE.Points(
  g,
  new THREE.PointsMaterial({ color: 0xff0000, size: 10 })
);

// const geometry = new THREE.BoxGeometry(10, 10, 10);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
scene.add(Point);
scene.add(new THREE.AxesHelper(1000));

const control = new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

console.log(camera);

animate();

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createSanjaLogoModel, createSanjaLogoEnvironment, createSanjaLogoInspectControls } from './createObjectModel';

const container = document.getElementById('container') as HTMLDivElement | null;
if (!container) {
  throw new Error('Missing #container');
}

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#ffffff');

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 0.5, 3.5);

const controls = createSanjaLogoInspectControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

const environment = createSanjaLogoEnvironment(renderer);
scene.environment = environment;

const model = createSanjaLogoModel({ qualityPriority: 'balanced' });
scene.add(model);

const box = new THREE.Box3().setFromObject(model);
const center = box.getCenter(new THREE.Vector3());
const size = box.getSize(new THREE.Vector3());
const maxDim = Math.max(size.x, size.y, size.z);
const fov = camera.fov * (Math.PI / 180);
const distance = maxDim / (2 * Math.tan(fov / 2)) * 1.2;
camera.position.set(0, center.y + distance * 0.2, distance);
camera.near = distance * 0.01;
camera.far = distance * 10;
camera.lookAt(center);
camera.updateProjectionMatrix();

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffffff, 1.0);
key.position.set(2, 3, 4);
scene.add(key);

const fill = new THREE.DirectionalLight(0xffffff, 0.4);
fill.position.set(-2, 1, 2);
scene.add(fill);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

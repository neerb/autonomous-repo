import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ORBIT_RADIUS = 4, ORBIT_SPEED = 0.0003, MOUSE_INFLUENCE = 0.4;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 50;
dirLight.shadow.camera.left = -15;
dirLight.shadow.camera.right = 15;
dirLight.shadow.camera.top = 15;
dirLight.shadow.camera.bottom = -15;
dirLight.shadow.bias = -0.0005;
scene.add(dirLight);

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x4fc3f7 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
scene.add(cube);

const diamondGeometry = new THREE.OctahedronGeometry(1.5);
const diamondMaterial = new THREE.MeshStandardMaterial({ color: 0xff4081 });
const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
diamond.position.set(-4, 0, 0);
diamond.castShadow = true;
scene.add(diamond);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x9c27b0 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(ORBIT_RADIUS, 0, 0);
sphere.castShadow = true;
scene.add(sphere);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0a0f, roughness: 0.9, metalness: 0.1 });
const groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
groundPlane.rotation.x = -Math.PI / 2;
groundPlane.position.y = -3;
groundPlane.receiveShadow = true;
scene.add(groundPlane);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate(time = 0) {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  diamond.rotation.y += 0.005;
  diamond.rotation.z += 0.003;

  const t = time * ORBIT_SPEED;
  sphere.position.x = Math.cos(t) * ORBIT_RADIUS;
  sphere.position.z = Math.sin(t) * ORBIT_RADIUS;

  dirLight.position.x = 5 + mouseX * MOUSE_INFLUENCE * 3;
  dirLight.position.z = 7.5 + mouseY * MOUSE_INFLUENCE * 3;
  dirLight.intensity = 1.0 + mouseY * 0.2;

  controls.update();
  renderer.render(scene, camera);
}
animate();

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

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
sphere.castShadow = true;
scene.add(sphere);

const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x0a0a0f,
  roughness: 0.8,
  metalness: 0.2
});
const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
groundPlane.rotation.x = -Math.PI / 2;
groundPlane.position.y = -3;
groundPlane.receiveShadow = true;
scene.add(groundPlane);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  directionalLight.position.x = 5 + mouseX * 3;
  directionalLight.position.z = 7.5 + mouseY * 3;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  diamond.rotation.z += 0.008;
  diamond.rotation.x += 0.012;
  
  sphere.position.x = Math.cos(elapsed * 0.6) * 2;
  sphere.position.z = Math.sin(elapsed * 0.6) * 2;
  
  controls.update();
  renderer.render(scene, camera);
}
animate();
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Mouse tracking state
let mouseX = 0;
let mouseY = 0;
let targetLightX = 0;
let targetLightY = 0;

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
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
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

const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x0a0a0f, 
  roughness: 0.8 
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2;
ground.receiveShadow = true;
scene.add(ground);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  diamond.rotation.y += 0.015;
  diamond.rotation.z += 0.008;
  
  const time = Date.now() * 0.0005; // ~12 second orbit
  const orbitRadius = 3;
  sphere.position.x = Math.cos(time) * orbitRadius;
  sphere.position.z = Math.sin(time) * orbitRadius;
  sphere.position.y = Math.sin(time * 2) * 0.3;
  
  targetLightX = mouseX * 2;
  targetLightY = mouseY * 2;
  directionalLight.position.x += (targetLightX - directionalLight.position.x) * 0.05;
  directionalLight.position.y += (targetLightY - directionalLight.position.y) * 0.05;
  
  controls.update();
  renderer.render(scene, camera);
}
animate();

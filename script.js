const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
scene.add(new THREE.PointLight(0xffffff, 2));

const textureLoader = new THREE.TextureLoader();

// Sun
const sunGeo = new THREE.SphereGeometry(2, 32, 32);
const sunTexture = textureLoader.load('textures/2k_sun.jpg');
const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Background
{
  const starTexture = textureLoader.load('textures/2k_stars_milky_way.jpg');
  const skyGeo = new THREE.SphereGeometry(200, 64, 64);
  const skyMat = new THREE.MeshBasicMaterial({ map: starTexture, side: THREE.BackSide });
  scene.add(new THREE.Mesh(skyGeo, skyMat));
}

const planetData = [
  { name: "Mercury", texture: "2k_mercury.jpg", distance: 4, size: 0.2, speed: 0.04 },
  { name: "Venus", texture: "2k_venus_surface.jpg", distance: 6, size: 0.4, speed: 0.03 },
  { name: "Earth", texture: "2k_earth_daymap.jpg", distance: 8, size: 0.5, speed: 0.02 },
  { name: "Mars", texture: "2k_mars.jpg", distance: 10, size: 0.4, speed: 0.015 },
  { name: "Jupiter", texture: "2k_jupiter.jpg", distance: 12, size: 1.2, speed: 0.01 },
  { name: "Saturn", texture: "2k_saturn.jpg", distance: 14, size: 1, speed: 0.009, hasRing: true },
  { name: "Uranus", texture: "2k_uranus.jpg", distance: 16, size: 0.9, speed: 0.008 },
  { name: "Neptune", texture: "2k_neptune.jpg", distance: 18, size: 0.9, speed: 0.007 }
];

const planets = [];
const speeds = {};

planetData.forEach(data => {
  const textureMap = textureLoader.load(`textures/${data.texture}`);
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ map: textureMap });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  planets.push({ ...data, mesh, angle: Math.random() * Math.PI * 2 });
  speeds[data.name] = data.speed;

  // Orbit ring (always visible)
  const ringGeo = new THREE.RingGeometry(data.distance - 0.01, data.distance + 0.01, 128);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
    depthWrite: false
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.visible = true;
  data.ring = ring;
  scene.add(ring);

  // Saturn ring
  if (data.hasRing) {
    const innerRadius = data.size * 1.25;
    const outerRadius = data.size * 2.2;
    const thetaSegments = 128;
    const satRingGeo = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);

    // UV fix for radial texture
    const pos = satRingGeo.attributes.position;
    const uv = satRingGeo.attributes.uv;
    const center = (innerRadius + outerRadius) * 0.5;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      uv.setXY(i, v3.length() < center ? 0 : 1, 1);
    }

    const satRingTex = textureLoader.load('textures/2k_saturn_ring_alpha.jpg');
    satRingTex.colorSpace = THREE.SRGBColorSpace;
    const satRingMat = new THREE.MeshBasicMaterial({
      map: satRingTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
      depthWrite: false
    });
    const saturnRing = new THREE.Mesh(satRingGeo, satRingMat);
    saturnRing.rotation.x = Math.PI / 2;
    saturnRing.position.set(0, 0, 0);
    mesh.add(saturnRing);
  }

  // Speed controls
  const label = document.createElement("label");
  label.innerText = data.name + ": ";
  const input = document.createElement("input");
  input.type = "range";
  input.min = 0.001;
  input.max = 0.1;
  input.step = 0.001;
  input.value = data.speed;
  input.oninput = e => speeds[data.name] = parseFloat(e.target.value);
  document.getElementById("controls").append(label, input);
});

// Tooltip
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById("tooltip");

function getPlanetNameByMesh(mesh) {
  if (mesh === sun) return "Sun";
  const planet = planets.find(p => p.mesh === mesh);
  return planet ? planet.name : null;
}

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([sun, ...planets.map(p => p.mesh)], false);

  if (intersects.length > 0) {
    const name = getPlanetNameByMesh(intersects[0].object);
    if (name) {
      tooltip.innerText = name;
      tooltip.style.left = (event.clientX + 10) + "px";
      tooltip.style.top = (event.clientY + 10) + "px";
      tooltip.style.display = "block";
      return;
    }
  }
  tooltip.style.display = "none";
});

// Animation
let camAngle = 0;
let isAnimating = true;
let isTopView = false;

function animate() {
  requestAnimationFrame(animate);

  if (!isAnimating) return;

  if (!isTopView) {
    camAngle += 0.001;
    camera.position.x = 30 * Math.sin(camAngle);
    camera.position.z = 30 * Math.cos(camAngle);
    camera.position.y = 10;
    camera.lookAt(0, 0, 0);
  }

  planets.forEach(p => {
    p.angle += speeds[p.name];
    p.mesh.position.x = Math.cos(p.angle) * p.distance;
    p.mesh.position.z = Math.sin(p.angle) * p.distance;
    if (p.hasRing && p.mesh.children.length > 0) {
      p.mesh.children[0].position.set(0, 0, 0);
    }
  });

  renderer.render(scene, camera);
}
animate();

// Pause/Resume
document.getElementById("toggleAnimation").addEventListener("click", () => {
  isAnimating = !isAnimating;
  document.getElementById("toggleAnimation").innerText = isAnimating ? "Pause" : "Resume";
});

// Theme Toggle
document.getElementById("toggleTheme").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
  document.getElementById("toggleTheme").innerText = isDark ? "Dark Mode" : "Light Mode";
});

// Top View Button
document.getElementById("topView").addEventListener("click", () => {
  isTopView = true;
  camera.position.set(0, 50, 0.01);
  camera.up.set(0, 0, -1);
  camera.lookAt(0, 0, 0);
});

// Restore orbit view on double click Sun
window.addEventListener("dblclick", () => {
  isTopView = false;
  camera.up.set(0, 1, 0);
});

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

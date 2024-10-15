const scene = new THREE.Scene();
let camera_location_x = 0;
let ghostModel, houseModel;
const generateGhosts = require('./ghost');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const groundGeometry = new THREE.PlaneGeometry(300, 300);
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('tex.jpg');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(2, 2);

const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
scene.add(ground);

// Wall Creation
const wallGeometry = new THREE.PlaneGeometry(100, 100);
const wallTexture = textureLoader.load('wall.jpg');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1, 1);

const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    side: THREE.DoubleSide
});
const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh.rotation.y = Math.PI; // Adjust the rotation if needed
wallMesh.position.set(0, 50, -150); // Position the wall appropriately
const wallMesh2 = wallMesh;
wallMesh2.position.set(-50, 0, 0);
scene.add(wallMesh);
scene.add(wallMesh2);

const loader = new THREE.GLTFLoader();



const radius = 5;
const widthSegments = 32;
const heightSegments = 32;
const sphereGeo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const earthTexture = textureLoader.load('earth.jpg'); // Check the path
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const sphere = new THREE.Mesh(sphereGeo, earthMaterial);
sphere.position.y = 150;
sphere.position.z = 200;
sphere.scale.set(10, 10, 10);
scene.add(sphere);

document.addEventListener('keydown', function (event) {
    const moveSpeed = 2; // Adjust camera movement speed
    switch (event.key) {
        case 'ArrowUp':
            camera.position.y += moveSpeed;
            break;
        case 'ArrowDown':
            camera.position.y -= moveSpeed;
            break;
        case 'ArrowLeft':
            camera.position.x -= moveSpeed;
            break;
        case 'ArrowRight':
            camera.position.x += moveSpeed;
            break;
    }
});

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (ghostModel) {
        ghostModel.position.x += 0.01;
        ghostModel.position.z += 0.01;
    }

    controls.update(); // Update controls
    renderer.render(scene, camera);
}
animate();




generateGhosts([2, 0, 0])
generateGhosts([8, 0, 10])
generateGhosts([82, 0, 71])



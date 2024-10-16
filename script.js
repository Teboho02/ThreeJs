
const scene = new THREE.Scene();
let camera_location_x = 0;
let ghostModel, houseModel;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 40);

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
   //     ghostModel.position.x += 0.01;
     //   ghostModel.position.z += 0.01;
    }

    controls.update(); // Update controls
    renderer.render(scene, camera);
}
animate();

function changeDirection(){



}

function generateGhosts(position) {

    loader.load('./ghost_in_a_white_sheet/scene.gltf', function (gltf) {
        ghostModel = gltf.scene;
        ghostModel.position.set(position[0], position[1], position[2]);
        let size = 10;
        ghostModel.scale.set(size, size, size);
        scene.add(ghostModel);
    }, undefined, function (error) {
        console.error('An error happened while loading the ghost model:', error);
    });


}

function createWall(zPos) {
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
    wallMesh.position.set(zPos, 50, 150); // Position the wall appropriately
    scene.add(wallMesh);
}
createWall(100);
createWall(0);
createWall(-100);

generateGhosts([2, 10, 0])


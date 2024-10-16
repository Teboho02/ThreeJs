import {bfs} from './bfs.js'
const scene = new THREE.Scene();
let camera_location_x = 0;
let ghostModel, houseModel;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 40);


const xMovements = [1, 1, 1, -1, -1, 2, 2]

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(100, 100, 1000);
directionalLight.castShadow = true;
directionalLight.castShadow = true
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

const rootGeometry = new THREE.PlaneGeometry(300, 300);
const roofMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide // Ensures both sides 
})

const roof = new THREE.Mesh(rootGeometry, roofMaterial);
roof.rotation.x = -Math.PI / 2;
roof.position.y = 100
//scene.add(roof)

const housLight = new THREE.DirectionalLight(0xffffff, 0.5);
housLight.position.set(1, 1, 1);
housLight.target = roof;
scene.add(housLight)

const loader = new THREE.GLTFLoader();

const CardinalDirections = {
    North: 1,
    East: 2,
    South: 3,
    West: 4
}



const radius = 5;
const widthSegments = 32;
const heightSegments = 32;
const sphereGeo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const earthTexture = textureLoader.load('earth.jpg'); // Check the path
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const sphere = new THREE.Mesh(sphereGeo, earthMaterial);
sphere.position.y = 250;
sphere.position.z = 300;
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

    }


    controls.update(); // Update controls
    renderer.render(scene, camera);
}
animate();

function changeDirection() {



}

document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            console.log('Up arrow was pressed');

            break;
        case 'ArrowDown':
            console.log('Down arrow was pressed');
            if (ghostModel) {
                ghostModel.rotateY(Math.PI / 2)
            }
            break;
        case 'ArrowLeft':
            console.log('Left arrow was pressed');
            if (ghostModel) {
                ghostModel.rotateY(Math.PI / 2)
            }
            break;
        case 'ArrowRight':
            console.log('Right arrow was pressed');
            if (ghostModel) {
                ghostModel.rotateY(-Math.PI / 2)
            }
            break;
        case 'W':
            console.log('Move forward');
            break;
        case 'A':
            console.log('');
            if (ghostModel) {
                ghostModel.rotateY(Math.PI / 2)
            }
            break;
        case 'S':
            console.log('W arrow was pressed');
            break;
        case 'D':
            console.log('W arrow was pressed');
            break;
        default:
            console.log('Other key pressed');
            break;
    }
});

function generateGhosts(position, yRotation) {

    loader.load('./ghost_in_a_white_sheet/scene.gltf', function (gltf) {
        ghostModel = gltf.scene;
        ghostModel.position.set(position[0], position[1], position[2]);
        let size = 10;
        ghostModel.scale.set(size, size, size);
        ghostModel.rotation.set(0, yRotation, 0);
        scene.add(ghostModel);
    }, undefined, function (error) {
        console.error('An error happened while loading the ghost model:', error);
    });




}

function getCamaraPosition() {

}

function createWall(xpos, zPos) {
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
    wallMesh.position.set(xpos, 50, zPos); // Position the wall appropriately
    scene.add(wallMesh);
}
createWall(100, 150);
createWall(0, 150);
createWall(-100, 150);
createWall(100, -150);
createWall(0, -150);
createWall(-100, -   150);

generateGhosts([2, 10, -114], Math.PI / 6);
generateGhosts([110, 10, 131], 0.2);
generateGhosts([-120, 10, 55], Math.PI);
generateGhosts([-10, 10, 12]), Math.PI / 3;
generateGhosts([12, 10, 22], Math.PI / 10);

const rows = 300;
const cols = 300;

const array = Array.from({ length: rows }, () => Array(cols).fill(0));
array[100][100] = 1;

bfs(array, {x : 20, z: 50}, {x:0, z : 0})

const goalgeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
const goalmaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const goal = new THREE.Mesh(goalgeometry, goalmaterial);
goal.position.set(100, 5, 100);
scene.add(goal);


const scene = new THREE.Scene();
let camera_location_x = 0;
let ghostModel, houseModel, ghostModel2;
let ghostMixer; 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 40);

const rows = 300;
const cols = 300;

const array = Array.from({ length: rows }, () => Array(cols).fill(0));

const xMovements = [1, 1, 1, -1, -1, 2, 2];

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(100, 100, 1000);
directionalLight.castShadow = true;
scene.add(directionalLight);

const lightSphereGeo = new THREE.SphereGeometry(120, 32, 32);
const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, emissive: 0xffff00 });
const lightSphere = new THREE.Mesh(lightSphereGeo, lightMaterial);
lightSphere.position.copy(directionalLight.position);
scene.add(lightSphere);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const groundGeometry = new THREE.PlaneGeometry(300, 300);
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('tex.jpg');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(2, 2);

const goalgeometry = new THREE.CylinderGeometry(1, 1, 20, 32);
const goalmaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const goal = new THREE.Mesh(goalgeometry, goalmaterial);
goal.position.set(0, 5, 0);
scene.add(goal);

const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
scene.add(ground);

const loader = new THREE.GLTFLoader();

const radius = 5;
const widthSegments = 32;
const heightSegments = 32;
const sphereGeo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const earthTexture = textureLoader.load('earth2.avif');
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const sphere = new THREE.Mesh(sphereGeo, earthMaterial);
sphere.position.y = 250;
sphere.position.z = 300;
sphere.scale.set(10, 10, 10);
scene.add(sphere);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

let currindex = 0;
let path = [];
let movementSpeed = 20;
let frameCounter = 0;

// BFS Algorithm
function bfs(grid, start, end) {
    let path = [];
    let directions = [
        { x: 1, z: 0 },
        { x: -1, z: 0 },
        { x: 0, z: 1 },
        { x: 0, z: -1 }
    ];

    let queue = [start];
    let visited = new Set();
    visited.add(`${start.x},${start.z}`);

    while (queue.length > 0) {
        let current = queue.shift();

        if (current.x === end.x && current.z === end.z) {
            path.push(current);
            break;
        }

        for (let direction of directions) {
            let next = {
                x: current.x + direction.x,
                z: current.z + direction.z
            };

            let key = `${next.x},${next.z}`;
            if (!visited.has(key)) {
                queue.push(next);
                visited.add(key);
                path.push(next);
            }
        }
    }

    return path;
}

// Function to load and animate the model
function generateGhosts(position, yRotation) {
    loader.load('./scp-096_original/scene.gltf', function (gltf) {
        ghostModel = gltf.scene;
        ghostModel.position.set(position[0], position[1], position[2]);
        let size = 10.1;
        ghostModel.scale.set(size, size, size);
        ghostModel.rotation.set(0, yRotation, 0);
        scene.add(ghostModel);

        // Create AnimationMixer for the ghost model
        ghostMixer = new THREE.AnimationMixer(ghostModel);

        // Play walk animation if available
        if (gltf.animations.length > 0) {
            console.log(gltf.animations)
            const walkAction = ghostMixer.clipAction(gltf.animations[0]);
            walkAction.play();
        }

        path = bfs(array, { x: goal.position.x, z: goal.position.z }, { x: ghostModel.position.x, z: ghostModel.position.z });
    }, undefined, function (error) {
        console.error('An error occurred while loading the ghost model:', error);
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update the ghost's position along the BFS path
    frameCounter++;
    if (ghostModel && path.length > 0 && currindex < path.length && frameCounter % movementSpeed === 0) {
     //   ghostModel.position.x = path[currindex].x;
   //     ghostModel.position.z = path[currindex].z;
        currindex++;
    }

    // Update animation mixer for the ghost model
    if (ghostMixer) {
        ghostMixer.update(0.005); // Adjust the value to control animation speed
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();

document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            console.log('Up arrow was pressed');
            break;
        case 'ArrowDown':
            console.log('Down arrow was pressed');
            if (ghostModel) {
                ghostModel.rotateY(Math.PI / 2);
            }
            break;
        case 'ArrowLeft':
            console.log('Left arrow was pressed');
            if (ghostModel) {
                ghostModel.rotateY(Math.PI / 2);
            }
            break;
        case 'ArrowRight':
            console.log('Right arrow was pressed');
            if (ghostModel) {
                ghostModel.rotateY(-Math.PI / 2);
            }
            break;
        case 'W':
            console.log('Move forward');
            break;
        case 'A':
            if (ghostModel) {
                ghostModel.rotateY(Math.PI / 2);
            }
            break;
        case 'S':
            console.log('S arrow was pressed');
            break;
        case 'D':
            console.log('D arrow was pressed');
            break;
        default:
            console.log('Other key pressed');
            break;
    }
});

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
    wallMesh.rotation.y = Math.PI;
    wallMesh.position.set(xpos, 50, zPos);
    scene.add(wallMesh);
}
createWall(100, 150);
createWall(0, 150);
createWall(-100, 150);
createWall(100, -150);
createWall(0, -150);
createWall(-100, -150);

// Generate ghost models and trigger BFS
generateGhosts([0, 0, 0], Math.PI / 3);

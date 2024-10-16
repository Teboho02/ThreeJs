
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
directionalLight.castShadow = true;
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

function changeDirection() {



}

document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            console.log('Up arrow was pressed');

            break;
        case 'ArrowDown':
            console.log('Down arrow was pressed');
            ghostModel.position.z -= 0.5;
            break;
        case 'ArrowLeft':
            console.log('Left arrow was pressed');
            break;
        case 'ArrowRight':
            console.log('Right arrow was pressed');
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

const goalgeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
const goalmaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const goal = new THREE.Mesh(goalgeometry, goalmaterial);
goal.position.set(100, 5, 100);
scene.add(goal);

// setInterval(()=>{
//     if(ghostModel){

//         const start = {
//             x : ghostModel.position.x,
//             y : ghostModel.position.y,
//             z : ghostModel.position.z
//         }

//         console.log(start)
//     }

// }, 100)

setTimeout(() => {
    if (ghostModel) {

        const start = {
            x: ghostModel.position.x,
            y: ghostModel.position.y,
            z: ghostModel.position.z
        }

        console.log(start)
    }

}, 1000)


// A* algorithm with 2D (x, z) movement
function Astar(grid, start, goal) {
    let openList = [];
    let closedList = [];
    let startNode = { position: { x: start.x, z: start.z }, g: 0, h: heuristic(start, goal), f: 0, parent: null };
    startNode.f = startNode.g + startNode.h;

    // Add startNode to the open list
    openList.push(startNode);

    while (openList.length > 0) {
        // Sort openList by lowest 'f' value and select the first node
        openList.sort((a, b) => a.f - b.f);
        let currentNode = openList.shift();  // Node with the lowest 'f' value

        // Check if we have reached the goal (2D comparison: x and z only)
        if (currentNode.position.x === goal.position.x &&
            currentNode.position.z === goal.position.z) {
            return reconstructPath(currentNode);  // Goal found, reconstruct the path
        }

        // Add currentNode to the closed list
        closedList.push(currentNode);

        // Get neighboring nodes
        let neighbors = getNeighbors(currentNode.position, grid);

        for (let neighbor of neighbors) {
            // Check if neighbor is already in the closed list
            if (closedList.some(node => isSamePosition(node.position, neighbor))) {
                continue;
            }

            // Calculate the g, h, and f values for the neighbor
            let g = currentNode.g + distance(currentNode.position, neighbor);
            let h = heuristic(neighbor, goal.position);
            let f = g + h;

            // If neighbor is in openList, check if this path is better
            let openNode = openList.find(node => (node.positiisSamePositionon, neighbor));
            if (openNode && g < openNode.g) {
                openNode.g = g;
                openNode.f = f;
                openNode.parent = currentNode;
            } else if (!openNode) {
                openList.push({
                    position: neighbor,
                    g: g,
                    h: h,
                    f: f,
                    parent: currentNode
                });
            }
        }
    }
    return [];  // Return an empty path if no path is found
}

// Heuristic function (Euclidean distance but considering only x and z)
function heuristic(node, goal) {
    return Math.sqrt(
        Math.pow(node.x - goal.x, 2) +
        Math.pow(node.z - goal.z, 2)  // Only x and z
    );
}

// Function to get neighboring nodes (adjacent cells in x-z plane)
function getNeighbors(position, grid) {
    let neighbors = [];
    let x = position.x;
    let z = position.z;

    // Add neighboring positions (x, z movement)
    neighbors.push({ x: x + 1, z: z });
    neighbors.push({ x: x - 1, z: z });
    neighbors.push({ x: x, z: z + 1 });
    neighbors.push({ x: x, z: z - 1 });

    // Check grid boundaries and obstacles before returning neighbors
    return neighbors.filter(neighbor => isValidPosition(neighbor, grid));
}

// Function to check if a position is valid in the grid (ignores y)
function isValidPosition(position, grid) {
    let x = position.x;
    let z = position.z;

    // Assuming the grid is a 2D array (for XZ plane), adjust accordingly
    return (x >= 0 && x < grid.length && z >= 0 && z < grid[0].length && grid[x][z] === 0);
}

// Function to reconstruct the path from goal to start
function reconstructPath(node) {
    let path = [];
    while (node) {
        path.push(node.position);
        node = node.parent;
    }
    return path.reverse();  // Reverse the path to get start -> goal
}

// Function to check if two positions are the same (x and z comparison)
function isSamePosition(pos1, pos2) {
    return pos1.x === pos2.x && pos1.z === pos2.z;
}

// Distance function (considering only x and z)
function distance(pos1, pos2) {
    return Math.sqrt(
        Math.pow(pos1.x - pos2.x, 2) +
        Math.pow(pos1.z - pos2.z, 2)  // Only x and z
    );
}

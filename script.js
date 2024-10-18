const scene = new THREE.Scene();
let ghostModel, ghostMixer;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 40);
let action = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls for mouse interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05; 
controls.update();

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(100, 100, 1000);
directionalLight.castShadow = true;
scene.add(directionalLight);

const lightSphereGeo = new THREE.SphereGeometry(5, 5, 32);
const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, emissive: 0xffff00 });
const target = new THREE.Mesh(lightSphereGeo, lightMaterial);
target.position.set(-100, 10, 100);
scene.add(target);



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
ground.position.y = 0;
scene.add(ground);

const loader = new THREE.GLTFLoader();

let hasReachedTarget = false;

function generateGhosts(position, yRotation) {
    loader.load('./scp-096_original/scene.gltf', function (gltf) {
        ghostModel = gltf.scene;
        ghostModel.position.set(position[0], position[1], position[2]);
        let size = 10.1;
        ghostModel.scale.set(size, size, size);
        ghostModel.rotation.set(0, yRotation, 0);
        scene.add(ghostModel);

        ghostMixer = new THREE.AnimationMixer(ghostModel);
        ghostModel.animations = gltf.animations;
        
        if (gltf.animations.length > 0) {
            console.log(gltf.animations);
            const walkAction = ghostMixer.clipAction(gltf.animations[action]);
            walkAction.play();
        }

    }, undefined, function (error) {
        console.error('An error occurred while loading the ghost model:', error);
    });
}

function moveTowardsTarget() {
    if (!ghostModel || !ghostMixer) return;

    const ghostPosition = ghostModel.position;
    const targetPosition = target.position;

    const distance = ghostPosition.distanceTo(targetPosition);
    const reachThreshold = 5; 

    if (distance > reachThreshold && !hasReachedTarget) {
        const direction = new THREE.Vector3().subVectors(targetPosition, ghostPosition).normalize();

        const speed = 0.5; 
        ghostModel.position.add(direction.multiplyScalar(speed));

        ghostModel.lookAt(targetPosition);

        if (ghostModel.animations.length > 0) {
            const walkAction = ghostMixer.clipAction(ghostModel.animations[5]); 
            walkAction.play();
        }
    } else if (!hasReachedTarget) {
        hasReachedTarget = true;
        
        ghostMixer.stopAllAction();
        
        if (ghostModel.animations.length > 0) {
            const targetAction = ghostMixer.clipAction(ghostModel.animations[0]);
            targetAction.play();
        }
        
        console.log("Ghost has reached the target!");
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (ghostMixer) {
        ghostMixer.update(0.01);
    }

    moveTowardsTarget();

    controls.update();
    renderer.render(scene, camera);
}

generateGhosts([-200, 5, 0], 0);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

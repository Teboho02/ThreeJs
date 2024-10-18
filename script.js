const scene = new THREE.Scene();
let ghostModel, ghostMixer;
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
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

const lightSphereGeo = new THREE.SphereGeometry(120, 32, 32);
const lightMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  emissive: 0xffff00,
});
const lightSphere = new THREE.Mesh(lightSphereGeo, lightMaterial);
lightSphere.position.copy(directionalLight.position);
scene.add(lightSphere);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const groundGeometry = new THREE.PlaneGeometry(300, 300);
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load("tex.jpg");
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(2, 2);

const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
scene.add(ground);

let isMovingForward = false;
let runAction,
  rotateLeft,
  rotateRight = false;

const loader = new THREE.GLTFLoader();

function generateGhosts(position, yRotation) {
  loader.load(
    "./scp-096_original/scene.gltf",
    function (gltf) {
      ghostModel = gltf.scene;
      ghostModel.position.set(position[0], position[1], position[2]);
      let size = 10.1;
      ghostModel.scale.set(size, size, size);
      ghostModel.rotation.set(0, yRotation, 0);
      scene.add(ghostModel);

      // Set up the animation mixer
      ghostMixer = new THREE.AnimationMixer(ghostModel);

      ghostModel.animations = gltf.animations;

      if (gltf.animations.length > 0) {
        console.log(gltf.animations);
      }
    },
    undefined,
    function (error) {
      console.error("An error occurred while loading the ghost model:", error);
    }
  );
}

// Function to play animations
function playAnimation(mixer, animations, animationIndex) {
  if (animations.length > 0 && animationIndex < animations.length) {
    const action = mixer.clipAction(animations[animationIndex]);
    action.reset();
    action.play();
  } else {
    console.error(`No animation found at index ${animationIndex}`);
  }
}

// Modify the animate function to handle movement and animation
function animate() {
  requestAnimationFrame(animate);

  if (ghostMixer) {
    ghostMixer.update(0.01); // Update the animation mixer
  }

  if (isMovingForward) {
    const direction = new THREE.Vector3();
    ghostModel.getWorldDirection(direction);
    ghostModel.position.addScaledVector(direction, 0.3); // Move forward
  }

  // Apply smooth rotation when left or right is pressed
  if (rotateLeft) {
    ghostModel.rotation.y += 0.05; // Rotate left
  }
  if (rotateRight) {
    ghostModel.rotation.y -= 0.05; // Rotate right
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

document.addEventListener("keydown", function (event) {
  if (!ghostModel || !ghostMixer) return;

  switch (event.key) {
    case "ArrowUp":
      isMovingForward = true; // Start moving forward

      if (!runAction) {
        runAction = ghostMixer.clipAction(ghostModel.animations[5]);
      }

      if (runAction.isRunning() === false) {
        runAction.reset();
        runAction.play();
      }

      break;

    case "ArrowDown":
      ghostModel.rotateY(Math.PI);
      break;

    case "ArrowLeft":
      rotateLeft = true;
      break;

    case "ArrowRight":
      rotateRight = true;
      break;

    default:
      break;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowUp") {
    isMovingForward = false;
    if (runAction) {
      runAction.stop();
    }
  }

  if (event.key === "ArrowLeft") {
    rotateLeft = false;
  }

  if (event.key === "ArrowRight") {
    rotateRight = false;
  }
});

// Generate ghost model and animations
generateGhosts([0, 5, 0], 0);

// Handle window resizing
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

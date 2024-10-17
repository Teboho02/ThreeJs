let mixer; // Global variable for the animation mixer

function generateGhosts(position) {
    loader.load('./ghost_in_a_white_sheet/scene.gltf', function (gltf) {
        ghostModel = gltf.scene;
        ghostModel.position.set(position[0], position[1], position[2]);
        let size = 2;
        ghostModel.scale.set(size, size, size);
        scene.add(ghostModel);

        // Create the animation mixer for this model
        mixer = new THREE.AnimationMixer(ghostModel);

        // Get the animations from the model
        let animations = gltf.animations;

        // If animations exist, play the first animation (walking animation assumed)
        if (animations && animations.length) {
            let walkAction = mixer.clipAction(animations[0]); // Assuming the first clip is the walking animation
            walkAction.play(); // Start playing the animation
        }
    }, undefined, function (error) {
        console.error('An error happened while loading the ghost model:', error);
    });
}

// In your render loop, update the animation mixer
function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(clock.getDelta()); // Update the mixer based on the clock delta time
    }

    renderer.render(scene, camera);
}

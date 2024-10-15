
function generateGhosts(position) {

    loader.load('./ghost_in_a_white_sheet/scene.gltf', function (gltf) {
        ghostModel = gltf.scene;
        ghostModel.position.set(position[0], position[1], position[2]);
        let size = 2;
        ghostModel.scale.set(size, size, size);
        scene.add(ghostModel);
    }, undefined, function (error) {
        console.error('An error happened while loading the ghost model:', error);
    });


}


module.exports = generateGhosts;
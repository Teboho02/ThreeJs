function checkVisited(visited, node) {
    let size = visited.length;
    for (let i = 0; i < size; i++) {
        if (visited[i].x === node.x && visited[i].z === node.z) {
            return true;
        }
    }
    return false;
}

export function bfs(matrix, goal, start) {
    let queue = [];
    queue.push(start);
    let curr = start;
    let goalFound = false;
    let neighbours;
    let parent = {};
    let visited = [];

    while (!goalFound && queue.length > 0) {
        curr = queue.shift(); // Remove from the front of the queue

        if (curr.x === goal.x && curr.z === goal.z) {
            goalFound = true;
            break;
        }

        visited.push(curr);
        neighbours = FindNeighbours(curr);

        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];
            if (!checkVisited(visited, neighbour) && !checkVisited(queue, neighbour)) {
                queue.push(neighbour);
                parent[`${neighbour.x},${neighbour.z}`] = curr; // Store parent for backtracking
                matrix[neighbour.x][neighbour.z] = 5; // Mark as visited in the matrix
            }
        }
    }

    if (goalFound) {
        let path = [];
        let step = goal;

        // Backtrack to find the path
        while (step) {
            path.push(step);
            step = parent[`${step.x},${step.z}`];
        }

        // Reverse the path to start from the beginning
        path.reverse();
        console.log("Path from start to goal:", path);
    } else {
        console.log("Goal not found.");
    }

    console.log("Start:", start);
    console.log(matrix);
}

function FindNeighbours(coord) {
    const x = coord.x;
    const z = coord.z;
    let neighbours = [];

    if (x > 0) {
        neighbours.push({ x: x - 1, z: z });
    }
    if (x < 8) {
        neighbours.push({ x: x + 1, z: z });
    }
    if (z > 0) {
        neighbours.push({ x: x, z: z - 1 });
    }
    if (z < 8) {
        neighbours.push({ x: x, z: z + 1 });
    }
    if (x > 0 && z > 0) {
        neighbours.push({ x: x - 1, z: z - 1 });
    }
    if (x < 8 && z > 0) {
        neighbours.push({ x: x + 1, z: z - 1 });
    }
    if (x > 0 && z < 8) {
        neighbours.push({ x: x - 1, z: z + 1 });
    }
    if (x < 8 && z < 8) {
        neighbours.push({ x: x + 1, z: z + 1 });
    }

    return neighbours;
}

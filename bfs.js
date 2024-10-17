function checkVisited(visited, node) {
    let size = visited.length;
    for (let i = 0; i < size; i++) {
        if (visited[i].x === node.x && visited[i].z === node.z) {
            return true;
        }
    }
    return false;
}

function heuristic(node, goal) {
    return Math.abs(node.x - goal.x) + Math.abs(node.z - goal.z);
}

export function bfs(matrix, goal, start) {
    let openSet = [];
    let gScore = {};
    let fScore = {};
    let parent = {};
    let visited = [];

    // Initialize the start node
    openSet.push(start);
    gScore[`${start.x},${start.z}`] = 0;
    fScore[`${start.x},${start.z}`] = heuristic(start, goal);

    let curr;
    let goalFound = false;

    while (openSet.length > 0) {
        openSet.sort((a, b) => fScore[`${a.x},${a.z}`] - fScore[`${b.x},${b.z}`]);

        curr = openSet.shift();

        if (curr.x === goal.x && curr.z === goal.z) {
            goalFound = true;
            break;
        }

        visited.push(curr);
        let neighbours = FindNeighbours(curr);

        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];
            if (checkVisited(visited, neighbour)) {
                continue;
            }

            // Tentative gScore
            let tentative_gScore = gScore[`${curr.x},${curr.z}`] + 1;

            // If the neighbour hasn't been explored or we found a shorter path
            if (!gScore[`${neighbour.x},${neighbour.z}`] || tentative_gScore < gScore[`${neighbour.x},${neighbour.z}`]) {
                parent[`${neighbour.x},${neighbour.z}`] = curr; // Store parent for backtracking
                gScore[`${neighbour.x},${neighbour.z}`] = tentative_gScore;
                fScore[`${neighbour.x},${neighbour.z}`] = tentative_gScore + heuristic(neighbour, goal);

                if (!checkVisited(openSet, neighbour)) {
                    openSet.push(neighbour);
                }
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
        return path;
    } else {
        console.log("Goal not found.");
    }
}

function FindNeighbours(coord) {
    const x = coord.x;
    const z = coord.z;
    let neighbours = [];

    if (x > 0) {
        neighbours.push({ x: x - 1, z: z });
    }
    if (x < 300) {
        neighbours.push({ x: x + 1, z: z });
    }
    if (z > 0) {
        neighbours.push({ x: x, z: z - 1 });
    }
    if (z < 300) {
        neighbours.push({ x: x, z: z + 1 });
    }
    if (x > 0 && z > 0) {
        neighbours.push({ x: x - 1, z: z - 1 });
    }
    if (x < 300 && z > 0) {
        neighbours.push({ x: x + 1, z: z - 1 });
    }
    if (x > 0 && z < 300) {
        neighbours.push({ x: x - 1, z: z + 1 });
    }
    if (x < 300 && z < 300) {
        neighbours.push({ x: x + 1, z: z + 1 });
    }

    return neighbours;
}

import "./lodash.js"
import "./gameVars.js"
import { NeuralNetwork } from "./neuralNetwork.js"


function findById(id) {

    return objects[id]
}

function newId() {

    nextId++
    return nextId - 1
}

function randomColor() {

    let value = Math.floor(Math.random() * Object.keys(colors).length)

    let key = Object.keys(colors)[value]

    let color = colors[key]
    return color
}

// Create map and implement values

map.el.style.width = mapDimensions + "px"
map.el.style.height = mapDimensions + "px"

// Dimensions / number of tiles will give size, size should be 10px

let gridSize = mapDimensions / gridPartSize

createGrid()

function createGrid() {

    // Loop through each position

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {

            let type = "gridPartParent"

            let id = newId()

            let gridPartParent = document.createElement("div")

            gridPartParent.id = id

            gridPartParent.classList.add("gridPartParent")

            gridPartParent.style.width = gridPartSize + "px"
            gridPartParent.style.height = gridPartSize + "px"

            map.el.appendChild(gridPartParent)

            objects[id] = { id: id, type: type, x: x, y: y }
        }
    }
}

// Music

let notMusicPlaying = true

document.addEventListener("mousedown", playMusic)
document.addEventListener("keydown", playMusic)

function playMusic() {

    if (notMusicPlaying) {

        let music = new Audio("materials/sounds/song1.mp4")
        music.loop = true
        music.play()

        notMusicPlaying = false
    }
}

// Allows user to scroll to zoom

let scale = 1

document.onwheel = function zoom(event) {

    event.preventDefault()

    scale += event.deltaY * -0.0005;

    scale = Math.min(Math.max(0.75, scale), 2)

    map.el.style.transform = "scale(" + scale + ")"
}

// Define events for when user presses a key

let upPos = 0
let leftPos = 0

window.onkeydown = function(event) {

    let key = event.key

    if (key == hotkeys.panUp) {

        startMove("up")

    } else if (key == hotkeys.panDown) {

        startMove("down")
    }
    if (key == hotkeys.panLeft) {

        startMove("left")

    } else if (key == hotkeys.panRight) {

        startMove("right")
    }

    if (key == hotkeys.stopPlacing) {

        stopPlacing()
    }

    if (key == hotkeys.moveUp) {

        movePlayer("up")
    }
    if (key == hotkeys.moveLeft) {

        movePlayer("left")
    }
    if (key == hotkeys.moveDown) {

        movePlayer("down")
    }
    if (key == hotkeys.moveRight) {

        movePlayer("right")
    }
}

window.onkeyup = function(e) {

    if (e.key == hotkeys.panUp) {

        endMove("up")
    } else if (e.key == hotkeys.panDown) {

        endMove("down")
    } else if (e.key == hotkeys.panLeft) {

        endMove("left")
    } else if (e.key == hotkeys.panRight) {

        endMove("right")
    }
}

var move = false

function startMove(direction) {

    if (direction == "up") {

        move = {
            direction: "up",
            qualifier: "positive"
        }

    } else if (direction == "down") {

        move = {
            direction: "up",
            qualifier: "negative"
        }

    }
    if (direction == "left") {

        move = {
            direction: "left",
            qualifier: "positive"
        }

    } else if (direction == "right") {

        move = {
            direction: "left",
            qualifier: "negative"
        }
    }
}

function endMove() {

    move = false
}

setInterval(changeDirection, 100)

function changeDirection() {

    if (move && move.direction) {
        if (move.direction == "up") {

            if (move.qualifier == "positive") {

                upPos += 150

            } else {

                upPos -= 150
            }
        } else {

            if (move.qualifier == "positive") {

                leftPos += 150

            } else {

                leftPos -= 150
            }
        }

        map.el.style.top = upPos + "px"
        map.el.style.left = leftPos + "px"
    }
}

// Place game objects

function placeObject(opts) {

    let id = newId()
    opts.id = id

    objects[id] = opts

    // Style element

    let el = document.createElement("div")

    el.classList.add(opts.type)
    el.id = id

    el.style.position = "absolute"

    el.style.top = gridPartSize * opts.y + "px"
    el.style.left = gridPartSize * opts.x + "px"

    let color = opts.color
    if (color) el.style.backgroundColor = color

    map.el.appendChild(el)
}

let playerCount = 100

for (let i = 0; i < playerCount; i++) placePlayer({ memory: {}, color: randomColor() })

function placePlayer(opts) {

    let type = "player"
    let pos = { x: 0, y: 0 }

    placeObject({
        type: type,
        x: pos.x,
        y: pos.y,
        memory: opts.memory,
        color: opts.color,
    })
}

placeGoal()

function placeGoal() {

    let type = "goal"
    let pos = { x: 49, y: 49 }
    placeObject({
        type: type,
        x: pos.x,
        y: pos.y,
    })
}

// AI

ai({
    tickSpeed: 1,
})

function ai(opts) {

    //

    let goal = findGoal()

    let generation = 0
    let pathLength = 0

    let lastReset = 0

    let options = {
        moveUp: function(player) {

            if (player.y <= 0) return

            player.y -= 1

            setPosition(player)
        },
        moveLeft: function(player) {

            if (player.x <= 0) return

            player.x -= 1

            setPosition(player)
        },
        moveDown: function(player) {

            if (player.y >= gridSize - 1) return


            player.y += 1

            setPosition(player)
        },
        moveRight: function(player) {

            if (player.x >= gridSize - 1) return

            player.x += 1

            setPosition(player)
        },
    }

    function setPosition(player) {

        let el = document.getElementById(player.id)

        el.style.top = gridPartSize * player.y + "px"
        el.style.left = gridPartSize * player.x + "px"
    }

    function findGoal() {

        for (let id in objects) {

            let object = findById(id)

            if (object.type == "goal") return object
        }
    }

    function findPlayers() {

        let players = []

        for (let id in objects) {

            let object = findById(id)

            if (object.type == "player") players.push(object)
        }

        return players
    }

    function isEqual(pos1, pos2) {

        if (pos1.x == pos2.x && pos1.y == pos2.y) return true
    }

    function reproduce(player, players, tick) {

        // Record stats

        generation++
        pathLength = player.memory.travelledPath.length

        // Loop through layers

        for (let player of players) {

            // Delete el

            let el = document.getElementById(player.id)
            el.remove()

            // Delete player

            delete objects[player.id]
        }

        // Record this tick as being the one it was reset on

        lastReset = tick

        //

        let distance = goal.x - player.x + goal.y - player.y

        player.memory.NeuralNetwork.learningRate = distance / gridSize

        // Create new players

        for (let i = 0; i < playerCount; i++) {

            let duplicateNetwork = _.cloneDeep(player.memory.NeuralNetwork)
            duplicateNetwork.learn()

            placePlayer({ memory: { NeuralNetwork: duplicateNetwork }, color: player.color })
        }
    }

    function runBatch(tick) {

        let players = findPlayers()

        for (let player of players) {

            //

            let inputs = [player.x, player.y]

            // Initialize player's memory

            if (!player.memory.travelledPath) player.memory.travelledPath = []
            if (!player.memory.NeuralNetwork) {

                // Create neural network

                let network = new NeuralNetwork()

                // Create layers

                let layerCount = 3

                for (let i = 0; i < layerCount; i++) network.addLayer({})

                // Create perceptrons

                // Create input perceptrons

                network.layers[0].addPerceptrons(inputs.length)

                // Create hidden perceptrons

                let hiddenPerceptronsNeed = 5

                // Loop through layers

                for (let layerName in network.layers) {

                    // Filter only hidden layers

                    let layersCount = Object.keys(network.layers).length

                    if (layerName > 0 && layerName < layersCount - 1) {

                        let layer = network.layers[layerName]

                        layer.addPerceptrons(hiddenPerceptronsNeed)
                    }
                }

                // Create output perceptrons

                network.layers[layerCount - 1].addPerceptrons(4)

                //

                network.config()

                //

                player.memory.NeuralNetwork = network
            }

            // If the player reaches the goal

            if (isEqual(player, goal)) {

                // Reproduce players

                reproduce(player, players, tick)
                return
            }

            // Run the network

            player.memory.NeuralNetwork.run({
                inputs: inputs
            })

            let layerCount = Object.keys(player.memory.NeuralNetwork.layers).length

            let lastLayer = player.memory.NeuralNetwork.layers[layerCount - 1]

            //

            movePlayer()

            function movePlayer() {

                // Loop through each perceptron in the lastLayer

                for (let perceptronName in lastLayer.perceptrons) {

                    let perceptron = lastLayer.perceptrons[perceptronName]

                    if (perceptron.activateValue > 0) continue

                    //

                    let option = options[Object.keys(options)[perceptronName]]
                    option(player, tick)

                    return
                }
            }

            //

            player.memory.NeuralNetwork.visualsParent.classList.remove("visualsParentShow")

            // Record where the player moves

            player.memory.travelledPath.push({ x: player.x, y: player.y })
        }

        // Find the closest pos to goal

        let lowestValue = Math.min.apply(Math, players.map(player => goal.x - player.x + goal.y - player.y))

        // Find closest player to goal

        let closestPlayer = players.filter(player => goal.x - player.x + goal.y - player.y == lowestValue)[0]

        // Display player's neural network

        closestPlayer.memory.NeuralNetwork.visualsParent.classList.add("visualsParentShow")

        closestPlayer.memory.NeuralNetwork.updateVisuals()

        // If a lot of time has passed since last reset

        if (tick - lastReset >= gridSize * 3) {

            // Reproduce with closest player

            reproduce(closestPlayer, players, tick)
        }
    }

    //

    let el = document.getElementById("fastestPossiblePath")

    let fastestPossiblePath = gridSize * 2 - 2
    el.innerText = fastestPossiblePath

    function updateUI() {

        // For each UI display update to current values

        let el

        el = document.getElementById("tick")
        el.innerText = tick

        el = document.getElementById("generation")
        el.innerText = generation

        el = document.getElementById("pathLength")
        el.innerText = pathLength
    }

    setInterval(runTick, opts.tickSpeed)

    let tick = 0

    function runTick() {

        runBatch(tick)

        updateUI()

        tick++
    }
}
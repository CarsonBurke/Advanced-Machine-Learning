class NeuralNetwork {
    constructor() {

    }
}

// Randomly adjust a value by a set amount

function mutate(value, amount) {

    // Decide if to subract or add

    let boolean = Math.floor(Math.random() * 2) + 1

    // Random amount to mutate

    let mutation = Math.random() * amount

    // Apply mutation

    if (boolean == 1) value += Math.random() * mutation
    if (boolean == 2) value -= Math.random() * mutation

    return value
}

// Weight the inputs by arbitrary values to inform the AI

NeuralNetwork.prototype.mutateWeights = function() {

    // Mutate weights

    let newWeights = []

    for (let weight of this.weights) newWeights.push(mutate(weight, 20))

    this.weights = newWeights
}

NeuralNetwork.prototype.createWeights = function() {

    let value = Math.floor(Math.random() * 10)

    this.weights = []
    for (let input of this.inputs) this.weights.push(value)
}

NeuralNetwork.prototype.updateWeights = function() {

    this.weightResults = []

    let i = 0

    for (let input of this.inputs) {

        let weight = this.weights[i]

        this.weightResults.push(input * weight)

        i++
    }
}

NeuralNetwork.prototype.applyWeights = function() {

    // If no weights exist create them

    if (!this.weights) this.createWeights()


    // Update weightResults to match inputs

    this.updateWeights()
}

// Convert the weights into a single arbitrary value

NeuralNetwork.prototype.transfer = function() {

    this.transferValue = 0

    for (let weightResult of this.weightResults) this.transferValue += weightResult
}

// Make sure the value is greater than 0

NeuralNetwork.prototype.activate = function() {

    this.activateValue = (Math.max(this.transferValue, 0)).toFixed(2)
}

NeuralNetwork.prototype.run = function() {

    this.applyWeights()

    this.transfer()

    this.activate()
}

NeuralNetwork.prototype.learn = function() {

    console.log("Learned")

    this.mutateWeights()
}

export { NeuralNetwork }
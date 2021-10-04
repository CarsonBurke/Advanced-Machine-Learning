// Assign variables

let properties = {
    mapDimensions: 1000,
    gridPartSize: 20,
    nextId: 0,
    map: {
        el: document.getElementById("map"),
        positions: [],
    },
    hotkeys: {
        moveUp: "ArrowUp",
        moveLeft: "ArrowLeft",
        moveDown: "ArrowDown",
        moveRight: "ArrowRight",

        panUp: "w",
        panDown: "s",
        panLeft: "a",
        panRight: "d",

        stopPlacing: "x",
    },
    colors: {
        red: "#b51818",
        blue: "#3718b5",
        green: "#18b543",
        yellow: "#e4ff00",
        purple: "#c700c2",
    },
    objects: {

    }
}

// Assign variables to

for (let propertyName in properties) {

    let property = properties[propertyName]

    globalThis[propertyName] = property
}
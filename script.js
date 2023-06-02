let main = document.querySelector(".main");

let playfield = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
];

let gameSpeed = 400;
let activeTetro = {
    x: 0,
    y: 0,
    shape: [
        [1,1,1],
        [0,1,0],
        [0,0,0],
    ],
};

let figures = {
O: [
    [1,1],
    [1,1]
],
I: [
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0]
],
S: [
    [0,1,1],
    [1,1,0],
    [0,0,0]
],
Z: [
    [1,1,0],
    [0,1,1],
    [0,0,0]
],
L:  [
    [1,0,0],
    [1,1,1],
    [0,0,0]
],
J: [
    [0,0,1],
    [1,1,1],
    [0,0,0]
],
T: [
    [1,1,1],
    [0,1,0],
    [0,0,0]
],
};

function draw () {
    let mainInnerHTML = "";
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield [y][x] === 1) {
                mainInnerHTML += '<div class="cell movingCell"></div>';
            } else if (playfield [y][x] === 2) {
                mainInnerHTML += '<div class="cell fixedCell"></div>';
            } else {
                mainInnerHTML += '<div class="cell"></div>';
            }
        }
    }
    main.innerHTML = mainInnerHTML;
}

function removePrevActiveTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
          if (playfield[y] [x] === 1) {
              playfield[y][x] = 0;
          }
        }
    }
}

function addActiveTetro () {
    removePrevActiveTetro();
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if(activeTetro.shape[y][x]) {
                playfield[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
            }
        }
    }
}

function rotateTetro() {
    const prevTetroState = activeTetro.shape;

    activeTetro.shape = activeTetro.shape[0].map ((val, index) =>
        activeTetro.shape.map((row) => row[index]).reverse()
    );

    if (hasCollisions()) {
        activeTetro.shape = prevTetroState;
    }
}

function hasCollisions() {
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (
                activeTetro.shape[y][x] &&
                (playfield[activeTetro. y + y] === undefined ||
                playfield[activeTetro. y + y][activeTetro. x + x] === undefined ||
                playfield[activeTetro.y + y ] [activeTetro. x + x] === 2)
            ) {
                return true;
            }
        }
    }
    return false;
}

function removeFullLines () {
    let canRemoveLine = true;
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] !== 2) {
                canRemoveLine = false;
                break;
            }
        }
        if (canRemoveLine) {
            playfield.splice(y, 1);
            playfield.splice(0, 0, [0,0,0,0,0,0,0,0,0,0]);
        }
        canRemoveLine = true;
    }
}

function getNewTetro() {
    const possibleFigures = 'IOJLTSZ';
   const rand = Math.floor(Math.random()*7);
   return figures[possibleFigures[rand]];
}

function fixTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield [y] [x] === 1) {
                playfield [y] [x] = 2;
            }
        }
    }
}

function moveTetroDown() {
    activeTetro.y += 1;
    if (hasCollisions()) {
        activeTetro.y -= 1;
        fixTetro();
        activeTetro.shape = getNewTetro();
        activeTetro.x =Math.floor((10 - activeTetro.shape[0].length)/2);
        activeTetro.y = 0;
    }
}

document.onkeydown = function (e) {
    if (e.keyCode === 37) {
        activeTetro.x -= 1;
        if (hasCollisions()) {
            activeTetro.x += 1;
        }
    } else if (e. keyCode === 39) {
        activeTetro.x +=1;
        if (hasCollisions()) {
            activeTetro.x -= 1;
        }
    } else if (e.keyCode === 40) {
        moveTetroDown();
    } else if (e.keyCode === 38) {
        rotateTetro();
        }
    addActiveTetro();
    draw();
};
addActiveTetro();
draw();

function startGame() {
    moveTetroDown();
    addActiveTetro();
    draw();
    setTimeout(startGame, gameSpeed);
}

setTimeout(startGame, gameSpeed);


let main = document.querySelector(".main");
const scroeElem = document.getElementById("score");
const levelElem = document.getElementById("level");
const nextTetroElem = document.getElementById("next-tetro");

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

let score = 0;
let currentLevel = 1;
let possibleLevels = {
   1: {
       scorePerLine: 700,
       speed: 400,
       nextLevelScore: 100000
   },
    2: {
        scorePerLine: 700,
        speed: 350,
        nextLevelScore: 200000
    },
    3: {
        scorePerLine: 700,
        speed: 300,
        nextLevelScore: 300000
    },
    4: {
        scorePerLine: 700,
        speed: 250,
        nextLevelScore: 400000
    },
    5: {
        scorePerLine: 700,
        speed: 200,
        nextLevelScore: 500000
    },
    6: {
        scorePerLine: 700,
        speed: 150,
        nextLevelScore: 600000
    },
    7: {
        scorePerLine: 700,
        speed: 120,
        nextLevelScore: 700000
    },
    8: {
        scorePerLine: 700,
        speed: 100,
        nextLevelScore: 800000
    },
    9: {
        scorePerLine: 700,
        speed: 80,
        nextLevelScore: 900000
    },
    10: {
        scorePerLine: 700,
        speed: 50,
        nextLevelScore: Infinity,
    },
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

let activeTetro = getNewTetro();
let nextTetro = getNewTetro();

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

function drawNextTetro() {
    let nextTetroInnerHTML = "";
    for (let y = 0; y < nextTetro.shape.length; y++) {
        for (let x = 0; x < nextTetro.shape[y].length; x++) {
            if (nextTetro.shape [y] [x]) {
                nextTetroInnerHTML = '<div class="cell movingCell"></div>';
            } else {
                mainInnerHTML += '<div class="cell"></div>';
            }
        }
    }
    nextTetroElem.innerHTML = nextTetroInnerHTML;
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
    let canRemoveLine = true,
        filledLines = 0;
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
            filledLines +=1;
        }
        canRemoveLine = true;
    }
    switch (filledLines) {
        case 1:
            score += 700;
            break;
        case 2:
            score += 1200;
            break;
        case 3:
            score += 2300;
            break;
        case 4:
            score += 24000;
            break;
    }
    scroeElem.innerHTML = score;

    if (score >= possibleLevels[currentLevel].nextLevelScore) {
        currentLevel++;
        levelElem.innerHTML = currentLevel;
    }

}

function getNewTetro() {
    const possibleFigures = 'IOJLTSZ';
   const rand = Math.floor(Math.random()*7);
   const newTetro = figures[possibleFigures[rand]];
return {
    x: Math.floor((10 - newTetro[0].length)/2),
    y: 0,
    shape: newTetro,

   };
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
        removeFullLines();
        activeTetro = getNewTetro();
    }
}

function dropTetro() {
    for (let y = activeTetro.y; y < playfield.length; y++) {
        activeTetro.y += 1;
        if (hasCollisions()) {
            activeTetro.y -= 1;
            break;
        }
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
    } else if (e.keyCode === 90) {
        rotateTetro();
        } else if(e.keyCode === 32) {
        dropTetro();
    };

    addActiveTetro();
    draw();
};

scroeElem.innerHTML = score;
levelElem.innerHTML = currentLevel;

addActiveTetro();
draw();
drawNextTetro();

function startGame() {
    moveTetroDown();
    addActiveTetro();
    draw();
    setTimeout(startGame, possibleLevels[currentLevel].speed);
}

setTimeout(startGame, possibleLevels[currentLevel].speed);


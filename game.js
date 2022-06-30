let lastRenderTime = 0;
const SNAKE_SPEED = 5;
const EXPANSION_RATE = 1;
const GRID_SIZE = 21;
const gameBoard = document.getElementById('game-board');
let gameOver = false;
let newSegments = 0;

function main(currentTime) {
    if (gameOver) {
        if (confirm('You lost. Press ok to restart.')) {
            window.location = 'file:///C:/Users/agust/Desktop/Games%20JS/Snake/index.html'
        }
        return
    }
    window.requestAnimationFrame(main);

    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) {
        return;
    };

    lastRenderTime = currentTime

    update();
    draw();
}

window.requestAnimationFrame(main);


function update() {
    updateSnake();
    updateFood();
    checkGameOver();
}

function draw() {
    gameBoard.innerHTML = ''
    drawSnake(gameBoard);
    drawFood(gameBoard)
}


// Snake

const SNAKE_BODY = [
    { x: 11, y: 11 },
];

function updateSnake() {
    addSegments();
    const snakeInputDirection = getInputDirection()

    for (let i = SNAKE_BODY.length - 2; i >= 0; i--) {
        SNAKE_BODY[i + 1] = {...SNAKE_BODY[i] }
    }

    SNAKE_BODY[0].x += snakeInputDirection.x
    SNAKE_BODY[0].y += snakeInputDirection.y

}

function drawSnake(gameBoard) {
    SNAKE_BODY.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add('snake')
        gameBoard.appendChild(snakeElement);
    });
}

function addSegments() {
    for (let i = 0; i < newSegments; i++) {
        SNAKE_BODY.push({...SNAKE_BODY[SNAKE_BODY.length - 1] })
    }
    newSegments = 0
}

function expandSnake(ammount) {
    newSegments += ammount
}

function onSnake(position, { ignoreHead = false } = {}) {
    return SNAKE_BODY.some((segment, index) => {
        if (ignoreHead && index === 0) return false
        return equalPositions(segment, position);
    })
}

function checkGameOver() {
    gameOver = outsideGrid(getSnakeHead()) || snakeOnSnake();
}

function getSnakeHead() {
    return SNAKE_BODY[0];
}

function snakeOnSnake() {
    return onSnake(getSnakeHead(), { ignoreHead: true })
}


// Input JS

let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (lastInputDirection.y !== 0) break
            inputDirection = { x: 0, y: -1 }
            break;
        case 'ArrowDown':
            if (lastInputDirection.y !== 0) break
            inputDirection = { x: 0, y: 1 }
            break;
        case 'ArrowLeft':
            if (lastInputDirection.x !== 0) break
            inputDirection = { x: -1, y: 0 }
            break;
        case 'ArrowRight':
            if (lastInputDirection.x !== 0) break
            inputDirection = { x: 1, y: 0 }
            break;
        default:
            break;
    }
})

function getInputDirection() {
    lastInputDirection = inputDirection
    return inputDirection;
}

// Food

let food = getRandomFoodPosition()

function updateFood() {
    console.log('ON SNAKE', onSnake(food))
    if (onSnake(food)) {
        expandSnake(EXPANSION_RATE)
        food = getRandomFoodPosition()
    }
}

function drawFood(gameBoard) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    gameBoard.appendChild(foodElement);
}



function equalPositions(position1, position2) {
    return (
        position1.x === position2.x && position1.y === position2.y
    )
}

function getRandomFoodPosition() {
    let newFoodPosition;

    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition();
    }

    return newFoodPosition;
}


function randomGridPosition() {

}


// grid

function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * GRID_SIZE) + 1,
        y: Math.floor(Math.random() * GRID_SIZE) + 1
    }
}


function outsideGrid(position) {
    return position.x < 1 || position.x > GRID_SIZE ||
        position.y < 1 || position.y > GRID_SIZE
}
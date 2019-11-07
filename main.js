const canvas = document.getElementById('myCanvas');
const text = document.getElementById('text');
const context = canvas.getContext('2d');
// untested without square
const gridX = 800;
const gridY = 800;
// needs to be a non-residual division of the grid
// otherwise snake pieces will overlap
const gridSize = 32;
let points = 0;
// snake
let pieces = [];

// draws the snake on the canvas
function draw(array) {
    array.forEach((element,index) => {
        // odd squares and even squares different colours
        // (index%2 == 0) ? context.fillStyle = "#001B87" : context.fillStyle = "#00A6D7";
        context.fillStyle = 'black';
        if (index == 0) {
            context.fillStyle = 'red';
        }
        context.fillRect(element.position.x, element.position.y, gridSize, gridSize);
    });
}

function clearCanvas () {
    canvas.width = canvas.width;
}

// global variable to clear interval
let interval;
// rename head for ease of use
let head;

function start() {
    points = 0;
    text.innerHTML = "Points: "+points;
    // if start is clicked again
    if (interval) {
        clearInterval(interval);
        pieces = [];
    }
    // create snake head
    const snake = new Snake();
    pieces.push(snake);
    draw(pieces);

    // rename for ease of use
    head = pieces[0];
    let ball = addBall();

    // listener for direction changing
    document.addEventListener('keyup',updateDirection);
    interval = setInterval(function() {
        // movement
        head.move();
        // once more than just a head it has to update all other pieces
        if (pieces.length > 1) {
            updateBody();
            // if (snakeCheck()) {
            //     stop();
            // }
        }
        

        if (ballCheck(ball)) {
            // add 4 pieces per ball to make a whole square
            for (let i = 0; i < 4; i++) {
                addPiece();
                updateBody();
            }
            points++;
            text.innerHTML = 'Points: '+points;
            ball = addBall();
        }

        clearCanvas();
        draw(pieces);
        addBall(ball);
    }, 17);
}

function between(x, min, max) {
    return min <= x && x <= max;
}

function ballCheck(ball) {
    let checkX = false;
    let checkY = false;
    if (between(head.position.x, ball.x, ball.x+gridSize) 
        ||
        between(head.position.x+gridSize, ball.x, ball.x+gridSize)
        ) {
        checkX = true;
    }

    if (between(head.position.y, ball.y, ball.y+gridSize)
        ||
        between(head.position.y+gridSize, ball.y, ball.y+gridSize)) {
        checkY = true;
    }
    
    return checkX && checkY;
}

// function snakeCheck() {
//     let checkX = false;
//     let checkY = false;
//     for (let i = 1; i < pieces.length; i++) {
//         const element = pieces[i];
//         console.log(element);
        
//         if (between(head.position.x, element.position.x, element.position.x+gridSize) 
//             ||
//             between(head.position.x+gridSize, element.position.x, element.position.x+gridSize)
//             ) {
//             checkX = true;
//         }
    
//         if (between(head.position.y, element.position.y, element.position.y+gridSize)
//             ||
//             between(head.position.y+gridSize, element.position.y, element.position.y+gridSize)) {
//             checkY = true;
//         }
//     }
//     return checkX && checkY;
// }

function stop() {
    if (interval) {
        clearInterval(interval);
    }
}

// adds a new piece based on the previous position of the last piece
function addPiece() {
    let lastPiece = pieces[pieces.length-1];
    let newPiece =  new SnakePiece(lastPiece.prevPosition.x, lastPiece.prevPosition.y)
    pieces.push(newPiece);
}

function updateBody() {
    for (let i = 1; i < pieces.length; i++) {
        const prevElement = pieces[i-1];
        const prevPosition = pieces[i].position;
        pieces[i] = new SnakePiece(prevElement.prevPosition.x, prevElement.prevPosition.y, prevPosition);
    }
}

// adds a ball 
function addBall(currentBall = null) {
    let ballPos;
    // uses old position
    if (currentBall) {
        ballPos = currentBall;
    } else {
        // generates new position if none specified
        ballPos = {
            x: Math.floor(Math.random()*(24*gridSize)),
            y: Math.floor(Math.random()*(24*gridSize))
        }
    }
    context.fillStyle = "white";
    context.fillRect(ballPos.x, ballPos.y, gridSize, gridSize);
    return ballPos;
}

// updates the direction
function updateDirection(e){
    if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */){
        head.changeDirection('up');
    }
    if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
        head.changeDirection('right');
    }
    if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
        head.changeDirection('down');
    }
    if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */){
        head.changeDirection('left');
    }
}

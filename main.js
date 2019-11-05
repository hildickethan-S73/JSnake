const canvas = document.getElementById('myCanvas');
const texto = document.getElementById('texto');
const context = canvas.getContext('2d');
// untested without square
const gridX = 800;
const gridY = 800;
// needs to be a non-residual division of the grid
// otherwise snake pieces will overlap
const gridSize = 32;

// snake
let pieces = [];

// draws the snake on the canvas
function draw(array) {
    array.forEach((element,index) => {
        // odd squares and even squares different colours
        (index%2 == 0) ? context.fillStyle = "#08B3E5" : context.fillStyle = "#0FBED8";
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
        }
        
        if (
            between(head.position.x, ball.x, ball.x+gridSize)
            &&
            between(head.position.y, ball.y, ball.y+gridSize)
            ) {
            
            // add 2 pieces per ball because the snake is small otherwise
            addPiece();
            updateBody();
            addPiece();
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

function stop() {
    if (interval) {
        clearInterval(interval);
    }
}

// adds a new piece based on the previous position of the last piece
function addPiece() {
    let lastPiece = pieces[pieces.length-1];
    let newPiece =  new Snake(lastPiece.prevPosition.x, lastPiece.prevPosition.y)
    pieces.push(newPiece);
}

function updateBody() {
    for (let i = 1; i < pieces.length; i++) {
        const prevElement = pieces[i-1];
        const prevPosition = pieces[i].position;
        pieces[i] = new Snake(prevElement.prevPosition.x, prevElement.prevPosition.y, prevPosition);
    }
}

function addBall(currentBall = null) {
    let ballPos;
    if (currentBall) {
        ballPos = currentBall;
    } else {
        ballPos = {
            x: Math.floor(Math.random()*(24*gridSize)),
            y: Math.floor(Math.random()*(24*gridSize))
        }
    }
    context.fillStyle = "black";
    context.fillRect(ballPos.x, ballPos.y, gridSize, gridSize);
    return ballPos;
}

function updateDirection(e){
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */){
    head.move('up');
  }
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
    head.move('right');
  }
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
    head.move('down');
  }
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */){
    head.move('left');
  }
}

// snake class
function Snake(x = 80, y = 80, prevPosition = null) {
    this.position = {
        x: x,
        y: y
    },
    this.directionX = 8,
    this.directionY = 8,
    this.prevPosition = prevPosition,
    this.direction = 'right',

    this.move = (direction = this.direction) => {
        switch (direction) {
            case 'right':
                this.right();
                break;

            case 'left':
                this.left();
                break;

            case 'down':
                this.down();
                break;

            case 'up':
                this.up();
                break;
        
            default:
                break;
        }
    }

    this.right = () => {
        this.direction = 'right';
        this.savePreviousPosition();
        this.position.x += this.directionX;
        this.checkHorizontal();
    },

    this.left = () => {
        this.direction = 'left';
        this.savePreviousPosition();
        this.position.x -= this.directionX;
        this.checkHorizontal();
    },

    this.down = () => {
        this.direction = 'down';
        this.savePreviousPosition();
        this.position.y += this.directionY;
        this.checkVertical();
    },

    this.up = () => {
        this.direction = 'up';
        this.savePreviousPosition();
        this.position.y -= this.directionY;
        this.checkVertical();
    },

    this.checkHorizontal = () => {
        if (this.position.x > 800 || this.position.x < 0) {
            this.die();
        }
    },

    this.checkVertical = () => {
        if (this.position.y > 800 || this.position.y < 0) {
            this.die();
        }
    }, 

    this.die = () => {
        texto.innerHTML = 'Has perdido';
        stop();
    },
    
    this.savePreviousPosition = () => {
        // this.prevPosition = this.position; creaba un pointer y no es lo que queremos
        this.prevPosition = {
            x: this.position.x,
            y: this.position.y
        };
    }
}
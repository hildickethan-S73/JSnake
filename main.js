const canvas = document.getElementById('myCanvas');
const texto = document.getElementById('texto');
const context = canvas.getContext('2d');
// snake
let pieces = [];
// snake class
function Snake(x = 80, y = 80, prevPosition = null) {
    this.position = {
        x: x,
        y: y
    },
    this.directionX = 40,
    this.directionY = 40,
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
        this.savePreviousPosition();s
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

// draws the snake on the canvas
function draw(array) {
    array.forEach((element,index) => {
        // odd squares black, even squares red
        (index%2 == 0) ? context.fillStyle = "black" : context.fillStyle = "red";
        context.fillRect(element.position.x, element.position.y, 40, 40);
        
    });
}

function clearCanvas () {
    canvas.width = canvas.width;
}

// global variable to clear interval
let interval;


function start() {
    // create snake head
    const snake = new Snake();
    pieces.push(snake);
    draw(pieces);

    // rename for ease of use
    let head = pieces[0];
    interval = setInterval(function() {
        // movement
        head.move('right');
        
        // once more than just a head it has to update all other pieces
        if (pieces.length > 1) {
            updateBody()
        }
        
        // adding pieces
        if (head.position.x == 200) {
            addPiece();
        }

        if (head.position.x == 400) {
            addPiece();
        }

        clearCanvas();
        draw(pieces);
    }, 400);
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
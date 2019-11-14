// snake class
class Snake {
    constructor(x = 80, y = 80, prevPosition = null) {
        // properties
        this.position = {
            x: x,
            y: y
        },
        this.directionX = 8,
        this.directionY = 8,
        this.prevPosition = prevPosition,
        this.direction = 'right',
        this.changeDirection = (direction) => {
            this.direction = direction;
        };

        // methods
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
        };
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
            if (this.position.x > document.getElementById('myCanvas').getAttribute('width') || this.position.x < 0) {
                this.die();
            }
        },
        this.checkVertical = () => {
            if (this.position.y > document.getElementById('myCanvas').getAttribute('height') || this.position.y < 0) {
                this.die();
            }
        },
        this.die = () => {
            document.getElementById('text').innerHTML = 'You lost!<br> Your score: '+points;
            // in main.js
            stop();
        },
        this.savePreviousPosition = () => {
            // this.prevPosition = this.position; creaba un pointer y no es lo que queremos
            this.prevPosition = {
                x: this.position.x,
                y: this.position.y
            };
        };
    }
}

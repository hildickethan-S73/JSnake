// get canvas
const canvas = document.getElementById('myCanvas');
const text = document.getElementById('text');
const context = canvas.getContext('2d');

// set grid size globally
// untested without square
const gridX = document.getElementById('myCanvas').getAttribute('width');
const gridY = document.getElementById('myCanvas').getAttribute('height');

// clear ranking button
document.getElementById('clearrankingbutton').addEventListener('click',clearRanking());

// fill ranking
let rankings = getRanking();
rankings.forEach(element => {
    addRanking(element.name,element.points);
});

// needs to be a non-residual division of the grid
// otherwise snake pieces will overlap
const gridSize = 32;
let piecesPerBall;
let points = 0;

// snake
let pieces = [];
// global variable to clear interval
let interval;
// rename head globally for ease of use
let head;

function start() {
    // get custom pieces per ball or default 4
    piecesPerBall = document.getElementById('piecesPerBall').value.trim() || 4;
    // reset points to 0
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
            // add X pieces per ball
            for (let i = 0; i < piecesPerBall; i++) {
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

// CANVAS FUNCTIONS

// draws the snake on the canvas
function draw(array) {
    array.forEach((element,index) => {
        // odd squares and even squares different colours
        // (index%2 == 0) ? context.fillStyle = "#001B87" : context.fillStyle = "#00A6D7";
        context.fillStyle = 'white';
        if (index == 0) {
            context.fillStyle = 'red';
        }
        context.fillRect(element.position.x, element.position.y, gridSize, gridSize);
    });
}

function clearCanvas () {
    canvas.width = canvas.width;
}

// SNAKE FUNCTIONS

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

// BALL FUNCTIONS

// adds a ball 
function addBall(currentBall = null) {
    let ballPos;
    // uses old position
    if (currentBall) {
        ballPos = currentBall;
    } else {
        // generates new position if none specified
        ballPos = {
            x: Math.floor(Math.random()*(gridX-gridSize)),
            y: Math.floor(Math.random()*(gridY-gridSize))
        }
    }
    context.fillStyle = "green";
    context.fillRect(ballPos.x, ballPos.y, gridSize, gridSize);
    return ballPos;
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

// OTHER FUNCTIONS

function stop() {
    if (interval) {
        clearInterval(interval);
        let regex = new RegExp(/^([a-zA-Z0-9]{3,15})$/);
        let name;
        do {
            name = prompt('Input your name for rankings (leave blank for no ranking)\nOnly 3 to 15 alphanumeric characters.');
            name = name.trim();
            if((name && !regex.test(name))) {
                alert('Bad input');
            }
            // name has to pass regex
            // blank name wont be ranked
            // ! because we want to exit when one of these is true
        } while (!((name && regex.test(name)) || !name));

        if (name) {
            checkRanking(name,points);
        }
	}
}

function between(x, min, max) {
    return min <= x && x <= max;
}

// RANKING FUNCTIONS

function checkRanking(playerName, playerPoints) {
    let table = document.getElementById('rankingTable');
    // delete rankings on DOM
    while (table.children[1]) {
        table.removeChild(table.children[1]);
    }
    
    let rankingLS = getRanking();
    let exists = false;

    // check if name already exists
    rankingLS.forEach(element => {
        if (element.name == playerName) {
            exists = true;
        }
    });
    
    // if it doesnt exist create it and push to LS
    if (!exists) {
        let player = {
            name: playerName,
            points: playerPoints
        };
        rankingLS.push(player);
        rankingLS = sortRanking(rankingLS);
        setRanking(rankingLS);

        addAllRankings(rankingLS);
    } else {
        rankingLS.forEach(element => {
            if (element.name == playerName) {
                if (element.points < playerPoints) {
                    element.points = playerPoints;
                    rankingLS = sortRanking(rankingLS);
                    setRanking(rankingLS);
                }
            }
        });

        addAllRankings(rankingLS);
    }
}

function addRanking(playerName,playerPoints) {
    let table = document.getElementById('rankingTable');
    let tr = document.createElement('tr');
    
    let tdName = document.createElement('td');
    tdName.innerHTML = playerName;
    tr.append(tdName);
    
    let tdPoints = document.createElement('td');
    tdPoints.innerHTML = playerPoints;
    tr.append(tdPoints);
    
    table.append(tr);
}

function addAllRankings(data) {
    data.forEach(element => {
        addRanking(element.name,element.points);
    });
}

function sortRanking(data) {
    data = data.sort((a,b) => (a.points < b.points) ? 1 : -1);
    return data;
}

function clearRanking() {
    let table = document.getElementById('rankingTable');
    // delete rankings on DOM
    while (table.children[1]) {
        table.removeChild(table.children[1]);
    }
    // delete rankings on LS
    setRanking([]);
}

function getRanking() {
    let data = localStorage.getItem('ranking');
    if (data == null) {
        data = [];
    } else {
        data = JSON.parse(data);
    }
    
    return data;
}

function setRanking(data) {
    localStorage.setItem('ranking',JSON.stringify(data));
}


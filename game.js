const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let gameSize = 450;
canvas.width = gameSize;
canvas.height = gameSize;
const backgroundColor = "black";
const unit = 15;
const left = 37;
const up = 38;
const right = 39;
const down = 40;
let difficult = 100;
const button = document.getElementById('playButton');

// Âm thanh
let eatSound = new Audio('../SoundEffects/eat.wav');
let loseSound = new Audio("../SoundEffects/lose.wav");
let startSound = new Audio("../SoundEffects/start.mp3");
let winSound = new Audio("../SoundEffects/win.wav");
let foodSound = new Audio("../SoundEffects/spawn.wav");

// điểm số
let mark = 0;
let bestMark = 0;
let score = document.getElementById("score");
score.innerHTML = "Score: " + mark + " Best score: "+ bestMark;
ctx.fillStyle = backgroundColor;
ctx.fillRect(0, 0, gameSize, gameSize)

// kĩ thuật class vector : định vị tọa độ dễ dàng hơn
class vectorCoordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let currentDirection = new vectorCoordinate(-1, 0);

// con rắn
class Snake {
    constructor() {
        this.body = [
            new vectorCoordinate(unit * 5, unit * 3),
            new vectorCoordinate(unit * 6, unit * 3),
            new vectorCoordinate(unit * 7, unit * 3),
        ]
        this.head = this.body[0];
        this.speed = new vectorCoordinate(-1, 0);
    }
    
    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.body[0].x, this.body[0].y, unit, unit);
        ctx.fillStyle = "white";
        for (let i = 1; i < this.body.length; i++) {
            ctx.fillRect(this.body[i].x, this.body[i].y, unit, unit)
        }
    }
    clear() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.body[0].x, this.body[0].y, unit, unit);
        ctx.fillStyle = "black";
        for (let i = 1; i < this.body.length; i++) {
            ctx.fillRect(this.body[i].x, this.body[i].y, unit, unit)
        }
    }
    checkBound(){
        if (this.body[0].x < 0) {
            this.body[0].x = gameSize-unit;
        }
        if (this.body[0].x > gameSize-unit) {
            this.body[0].x = 0 ;
        }
        if (this.body[0].y < 0) {
            this.body[0].y = gameSize-unit;
        }
        if (this.body[0].y > gameSize-unit) {
            this.body[0].y = 0 ;
        }
    }
    move() {
        this.clear();
        for (let i = this.body.length - 1; i >= 1; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        this.body[0].x += this.speed.x * unit;
        this.body[0].y += this.speed.y * unit;

        this.checkBound();
        this.draw();
    }
    checkEat(food) { // check ăn 
        let head = this.body[0];
        return food.x === head.x && food.y === head.y
    }
    grow() { // tăng độ dài rắn
        this.clear();
        let snakeLength = this.body.length;
        let mountX = this.body[snakeLength - 1].x - this.body[snakeLength - 2].x;
        let mountY = this.body[snakeLength - 1].y - this.body[snakeLength - 2].y;

        let newPart = new vectorCoordinate(
            this.body[snakeLength - 1].x + mountX,
            this.body[snakeLength - 1].y + mountY
        )
        this.body.push(newPart);
        this.draw();
        console.log(this.head.x);
    }
    
    checkEnd() {
        for (let i = 4; i <= this.body.length; i++) {
            if (this.body[i].x === this.body[0].x && this.body[i].y === this.body[0].y) 
            return true
        }
    }
    toDefault(){
        console.log(this.body.length > 3);
        while (this.body.length > 3) {
            this.body.pop();
        }
    }
    checkWin(){
        return this.body.length == gameSize*2;
    }
}
// di chuyển rắn
document.onkeydown = function (button) {
    switch (button.keyCode) {
        case left:
            if (currentDirection.x === 1) {
                break // tranh viec quay dau ran
            }
            player.speed = new vectorCoordinate(-1, 0);
            currentDirection = new vectorCoordinate(-1, 0);
            break;
        case right:
            if (currentDirection.x === -1) {
                break // tranh viec quay dau ran
            }
            player.speed = new vectorCoordinate(1, 0);
            currentDirection = new vectorCoordinate(1, 0);
            break;
        case up:
            if (currentDirection.y === 1) {
                break // tranh viec quay dau ran
            }
            player.speed = new vectorCoordinate(0, -1);
            currentDirection = new vectorCoordinate(0, -1);
            break;
        case down:
            if (currentDirection.y === -1) {
                break // tranh viec quay dau ran
            }
            player.speed = new vectorCoordinate(0, 1);
            currentDirection = new vectorCoordinate(0, 1);
            break;
        default:
            break;
    }
}

// thức ăn
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, unit, unit);
    }
    clear() {
        ctx.fillStyle = "black";
        ctx.clearRect(this.x, this.y, unit, unit);
    }
    getRandomNumber() {
        let randomNumber = Math.floor(Math.random() * gameSize);
        randomNumber -= randomNumber % unit;
        return randomNumber;
    }
    spawn() {
        this.x = this.getRandomNumber();
        this.y = this.getRandomNumber();
        this.draw();
    }

}



let player = new Snake();
player.draw();
let food = new Food();
food.spawn();

function play() {
    startSound.play();
    function myStopFunction() {
        clearInterval(myLoop);
    }
    button.setAttribute('disabled', '');
    var myLoop = setInterval(function () {
        console.log();
        player.move();
        if (player.checkEat(food)) {
            player.grow();
            food.spawn();
            foodSound.play();
            mark++;
            let score = document.getElementById("score");
            score.innerHTML = "Score: " + mark + " Best score: "+ bestMark;
            eatSound.play();
        }
        if (player.checkWin()) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, gameSize, gameSize);
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText("YOU WIN", 120, 100);
            winSound.play();
            myStopFunction();
        }
        if (player.checkEnd()) {
            if (mark >= bestMark) {
                bestMark = mark;
                score.innerHTML = "Score: " + mark + " Best score: " + bestMark;
            } 
            console.log(bestMark);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, gameSize, gameSize);
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText("GAME OVER", 120, 100);
            loseSound.play();
            myStopFunction();
        }
    }, difficult); 
}
function reset() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, gameSize, gameSize);
    player.toDefault();
    player.draw();
    food.spawn();
    mark = 0;
    score.innerHTML = "Score: " + mark + " Best score: " + bestMark;
    play();
}











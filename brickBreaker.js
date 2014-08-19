// TODO: organization (maybe separate files)
// TODO: animate bricks breaking
// TODO: starting position of ball
// TODO: another powerup -> + points
// TODO: maybe look into how ball bounces off bricks again
// TODO: positioning of messages lower
// TODO: pause button
var ww = window.innerWidth - 15;
var wh = window.innerHeight - 15;

var c = document.getElementById('gameCanvas');
gameCanvas.width = ww;
gameCanvas.height = wh;

var ctx = c.getContext('2d');

console.log(ww);

var lives = 2;
var score = 0;
var level = 1;
var start = true;
var dead = false;
if (!localStorage.hiScore){
    localStorage.hiScore = 0;
} 
var baseBallSpeed = 4;
var basePaddleWidth = 80;

var balls = [];
balls.push(new Ball(baseBallSpeed, 2, ww, wh));
balls[0].fireball;
var paddle = new Paddle(230, basePaddleWidth);
var powerUps = [];
powerUps.push(new PowerUp());
var bricks = [];
var brickW = 60;
var brickH = 25;
var bricksInRow = Math.floor(ww / (brickW * 2));
var bricksInColumn = Math.floor(wh / (brickH + 150));
var brickWSpace = (ww - bricksInRow * brickW) / (bricksInRow);

var messages = [];
//colors = ["#6600CC", "#3333FF", "#00CC00", "#FFFF00", "#FF6600"];
//ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];


for(var i = 0; i < bricksInRow; i++){
    for(var c = 0; c < bricksInColumn; c++){
        bricks.push(new Brick(i * brickW + i * brickWSpace + brickWSpace, 
            2 * c * brickH + 20, brickW, brickH));
    }
}

ctx.font = "20px Verdana";
ctx.fillText("Brick Breaker", ww / 2 - 50, wh / 2 + 50);
ctx.fillText("Click to start", ww / 2 - 50, wh/2 + 80);

$(document).mousemove(function(event){
    movePaddle(event.pageX);
});

var movePaddle = function(x)
{
    paddle.x = x;
};

$(document).mousedown(function(event) {
    if (start) {
        animate();
        start = false;
    } else {
        justDied();
    }
    dead = false;
});

var justDied = function()
{
    if (balls.length === 0 && lives > 0) {
        balls.push(new Ball(baseBallSpeed, 2, ww, wh));
        powerUps.length = 0;
        paddle.w = basePaddleWidth;
        --lives;
    }
    if (balls.length === 0 && lives === 0) {
        newGame();
    }
};

var newGame = function()
{
    score = 0;
    lives = 3;
    level = 1;
    paddle.w = basePaddleWidth;
    baseBallSpeed = 4;
    bricksInColumn = Math.floor(wh / (brickH + 150));
    balls.push(new Ball(baseBallSpeed, 2, ww, wh));
    bricks.length = 0;
    for(var i = 0; i < bricksInRow; i++){
        for(var c = 0; c < bricksInColumn; c++){
            bricks.push(new Brick(i * brickW + i * brickWSpace + 
                brickWSpace, 2 * c * brickH + 20, brickW, brickH));
        }
    }
};

var animate = function()
{
    if (!dead) {
        ctx.clearRect(0, 0, ww, wh);
        ctx.strokeRect(0, 0, ww, wh);
        handleMessages();
        writeText();
        handleBalls();
        handleBricks();
        handlePowerUps();
        // draw paddle
        ctx.fillStyle = "#000000"
        ctx.fillRect(paddle.x - paddle.w / 2, wh - 5, paddle.w, 5);
    }
    requestAnimationFrame(animate);
};

var handleMessages = function()
{
    for (var i = 0; i < messages.length; i++) {
        var m = messages[i];
        ++m.timer;
        ctx.font = "20px Verdana";
        ctx.fillStyle = m.color;
        ctx.fillText(m.message, ww / 2 - 50, wh / 2 + 200 + i * 30);
    };
    for (var i = 0; i < messages.length; i++) {
        if (messages[i].timer > 100) {
            messages.splice(i, 1);
        }
    };
};

var writeText = function()
{
    ctx.fillStyle = "#000000";
    if (balls.length === 0) {
        dead = true;
        ctx.clearRect(ww/2 - 70, wh / 2 + 30, 170, 80);
        //ctx.strokeRect(ww/2 - 70, wh / 2 + 30, 170, 80);
        ctx.font = "20px Verdana";
        ctx.fillText("You died!", ww / 2 - 50, wh / 2 + 50);
        if (lives > 0) {
            ctx.fillText("Click to continue", ww / 2 - 70, wh / 2 + 100);
        } else {
            ctx.fillText("Click to play again", ww / 2 - 100, wh/2 + 100);
        }
    }
    ctx.font = "15px Verdana";
    ctx.fillText("Level: " + level, 10, wh / 2 + 250);
    ctx.fillText("Lives: " + lives, 10, wh / 2 + 270);
    ctx.fillText("Score: " + score, ww - 120, wh/2 + 250);
    ctx.fillText("High Score: " + localStorage.hiScore, ww - 150, wh / 2 + 270);
};

var handleBalls = function() 
{
    for(var i = 0; i < balls.length; ++i){
        var b = balls[i];
        ctx.fillStyle = "#000000";
        if(b.fireball) {
            ctx.fillStyle = "#FF0000";
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, 2*Math.PI, false);
        ctx.fill();
        ++b.firetimer;
        ++b.slowmotimer;
        ++b.bigtimer;
        if (b.firetimer > 1000) {
            b.fireball = false;
        }
        if (b.slowmotimer > 1000) {
            b.setSpeed(baseBallSpeed);
        }
        if (b.bigtimer > 1000) {
            b.setRadius(5);
        }
        if (!b.move(bricks, paddle)) {
            balls.splice(i, 1);
        }
    }
};

var handleBricks = function()
{
    ctx.fillStyle = "#000000";    
    for(var i = 0; i < bricks.length; ++i){
        var b = bricks[i];
        ctx.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h);
    }
    if (bricks.length === 0) {
        nextLevel();
    }
};

var nextLevel = function()
{
    ++level;
    ++bricksInColumn;
    if (wh - 80 < 2 * bricksInColumn * brickH) {
        --bricksInColumn;
    }
    for(var i = 0; i < bricksInRow; i++){
        for(var c = 0; c < bricksInColumn; c++){
            bricks.push(new Brick(i * brickW + i * brickWSpace + brickWSpace, 
            2 * c * brickH + 20, brickW, brickH));
        }
    }
    ++baseBallSpeed;
    for (var i = 0; i < balls.length; i++) {
        balls[i].setSpeed(baseBallSpeed);
    };
    messages.push(new Message(120, level));

}

var handlePowerUps = function()
{
    if(Math.floor(Math.random()*5000) > 4990) {
        powerUps.push(new PowerUp());
    }
    ctx.fillStyle = "#000000";
    for(var i = 0; i < powerUps.length; ++i) {
        var p = powerUps[i];
        ctx.strokeRect(p.x - p.w/2, p.y - p.h/2, p.w, p.h);
        ctx.font = "20px Verdana";
        ctx.fillText("?", p.x - p.w/4, p.y+ p.h/2 - 3);
        if(p.pastBottom()) {
            powerUps.splice(i, 1);
            break;
        }
        if (p.touchingPaddle(paddle)) {
            implementPowerUp(p.kind);
            messages.push(new Message(p.kind, level));
            powerUps.splice(i, 1);
            break;
        }
    }
};

var implementPowerUp = function(kind)
{
    if(kind >= 0 && kind < 5) {
        ++lives;
    } else if(kind >= 5 && kind < 25){
        paddle.addWidth();
    } else if(kind >= 25 && kind < 40) {
        for (var i = 0; i < balls.length; i++) {
            var b = balls[i];
            b.setSpeed(baseBallSpeed - 2);
            b.slowmotimer = 0;
        };
    } else if(kind >= 40 && kind < 60) {
        for (var i = 0; i < balls.length; i++) {
            var b = balls[i];
            b.fireball = true;
            b.firetimer = 0;
        };
    } else if (kind >= 60 && kind < 80) {
        balls.push(new Ball(baseBallSpeed, 2, ww, wh));
    } else {
        for (var i = 0; i < balls.length; i++) {
            var b = balls[i];
            b.setRadius(10);
            b.bigtimer = 0;
        };
    }
};

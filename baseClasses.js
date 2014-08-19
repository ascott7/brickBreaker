function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Ball(speed, theta, screenWidth, screenHeight) 
{
    this.x = 250.0;
    this.y = 400.0;
    this.speed = speed;
    this.theta = theta;
    this.fireball = false;
    this.radius = 5;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.firetimer = 0;
    this.slowmotimer = 0;
    this.bigtimer = 0;

    this.setSpeed = function(speed) {
        this.speed = speed;
    };

    this.setRadius = function(r) {
        this.radius = r;
    }

    this.move = function(bricks, paddle) {
        ++this.timer;
        // hit left wall
        if(this.x < this.radius){
            this.theta = Math.PI - this.theta;
            this.x = this.radius + 1;    
        }
        // hit right wall
        if(this.x > screenWidth - this.radius){
            this.theta = Math.PI - this.theta;
            this.x = screenWidth - this.radius - 1;   
        }
        // hit top wall
        if(this.y < this.radius){
            this.theta = -this.theta;
            this.y = this.radius + 1;
        }
        // bottom of screen
        if(this.y > this.screenHeight - this.radius) { 
            // touching the paddle
            if(this.x + this.radius > paddle.x - paddle.w/2 && 
                this.x - this.radius < paddle.x + paddle.w/2){
                diff = (paddle.x - this.x) / (paddle.w * 2);
                this.theta = -this.theta + diff;
                if(this.theta < Math.PI / 4 && this.theta > - Math.PI / 4)
                    this.theta = Math.PI / 4;
                if(this.theta > 3 * Math.PI / 4 && this.theta < Math.PI)
                    this.theta = 3 * Math.PI / 4; 
                console.log(this.y);
                this.y = screenHeight - 2*this.radius - 1;
            }
            else {
                return false;
            }
        }

        this.hitBricks();

        // move the ball
        this.x = this.x + this.speed * Math.cos(this.theta);
        this.y = this.y - this.speed * Math.sin(this.theta);
        return true;
    };

    this.hitBricks = function() {
        // an array of points around the circle
        var tempPoints = [];
        for (var i = 0; i < 8; ++i) {
            tempX = this.x + this.radius * Math.cos(this.theta + i * Math.PI / 4);
            tempY = this.y - this.radius * Math.sin(this.theta + i * Math.PI / 4);
            tempPoints.push(new Point(tempX, tempY));
        }
        for(var i = 0; i < bricks.length; ++i) {
            var b = bricks[i];
            for (var j = 0; j < tempPoints.length; ++j) {
                tempX = tempPoints[j].x;
                tempY = tempPoints[j].y;
                // if a point is inside a brick, we hit the brick
                if (tempX > b.x - b.w/2 && tempX < b.x + b.w/2 && 
                    tempY > b.y - b.h/2 && tempY < b.y + b.h/2) {
                    if (!this.fireball){
                        // inside left or right, means touching top or bottom of brick
                        if (this.x - this.radius/2 < b.x + b.w/2 && this.x + 
                            this.radius/2 > b.x - b.w/2){
                            this.theta = -this.theta;
                        }
                        // touching left or right of brick
                        else {
                            this.theta = Math.PI - this.theta;
                        }
                    }
                    bricks.splice(i, 1);
                    score += level * 5;
                    if (score > localStorage.hiScore) {
                        localStorage.hiScore = score;
                    }
                    break;
                }
            }
        }
    };
}

function Brick(x, y, w, h)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function Paddle(x, w)
{
    this.x = x;
    this.w = w;

    this.addWidth = function() {
        this.w += 80;
        if (this.w >= ww) {
            this.w -= 80;
        }
    };
}

function PowerUp()
{
    this.kind = Math.floor(Math.random()*100);
    this.x = Math.floor(Math.random()*(ww - 30) + 15);
    this.y = 0;
    this.w = 20;
    this.h = 20;
    this.pastBottom = function() {
        ++this.y;
         if (this.y - this.w / 2 >= wh) {
            return true;
        }
        return false;
    }
    this.touchingPaddle = function(paddle) {
        if(this.y >= wh - 5 && this.x > paddle.x - paddle.w / 2 
            && this.x < paddle.x + paddle.w / 2) {
            return true;
        }
        return false;
    }
}

function Message(kind, level)
{
    this.color = "#000000";
    if(kind >= 0 && kind < 5) {
        this.message = "+1 Life!";
    } else if(kind >= 5 && kind < 25){
        this.message = "Longer Paddle!";
    } else if(kind >= 25 && kind < 40) {
        this.message = "Slow Mo!";
    } else if(kind >= 40 && kind < 60) {
        this.message = "Fireball!";
        this.color = "#FF0000";
    } else if(kind >= 60 && kind < 80) {
        this.message = "Extra ball!";
    } else if(kind >= 80 && kind < 100){
        this.message = "Big Ball!";
    }
    else {
        this.message = "Level " + level + "!";
    }
    this.timer = 0;
}
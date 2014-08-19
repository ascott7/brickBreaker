var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.fillRect(0,0,150,75);

ctx.beginPath();
ctx.arc(190,50,40,0,2*Math.PI);
ctx.stroke();

ctx.fillStyle = "#000000";
ctx.font = "30px Arial";
ctx.fillText("Hello World",10,50);
ctx.strokeText("Hello World",10,90);

var img = new Image();
img.onload = function() {
        ctx.drawImage(img, 200, 50, 50, 50);
      };
img.src = "http://www.clker.com/cliparts/3/V/g/m/8/w/basketball-md.png";

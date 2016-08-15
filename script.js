var canvas = document.getElementById('glitch');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var player = new Player();
var border = new Border();
var pressCkeck = false;

setInterval(world,30);

window.addEventListener("keypress", function(e){
	if (e.keyCode >= 49 && e.keyCode <= 49+(player.hands).length-1
		&& !pressCkeck) {
		player.glitchTo(e.keyCode-49);
		pressCkeck = true;
	}
});

function clearCanvas() {
	context.fillStyle = "#111";
	context.fillRect(0,0,canvas.width,canvas.height);
}

function randomBetween(min,max) {
	return Math.floor((Math.random()*(max - min)+min));
}

function world() {
	clearCanvas();
	if (pressCkeck) pressCkeck = false;
	border.update().draw();
	player.update().draw();
}

function Player() {
	this.x = canvas.width/2; 
	this.y = canvas.height/2;

	this.handGap = 50;
	this.radius = 25;

	this.generateHands = function() {
		this.hands = [];
		for (var i = 0; i < 4; i++) {
			(this.hands).push(new Hand(this.handGap*(i+1)));
		}
	}; this.generateHands();

	this.glitchTo = function(i) {
		if ((this.hands)[i].x - this.radius > border.xgap &&
			(this.hands)[i].y - this.radius > border.ygap &&
			(this.hands)[i].x + this.radius < canvas.width-border.xgap &&
			(this.hands)[i].y + this.radius < canvas.height-border.ygap &&
			!(this.hands)[i].isLoading) {

			this.x = (this.hands)[i].x;
			this.y = (this.hands)[i].y;
			(this.hands)[i].used();
			// this.generateHands();
		}
	}

	this.update = function() {
		for (var i = 0; i < (this.hands).length; i++)
			(this.hands)[i].update(this);
		return this;
	}

	this.draw = function() {
		context.strokeStyle = "#fff";
		context.fillStyle = "#fff";
		context.beginPath();
		context.arc(this.x,this.y,this.radius,Math.PI*2,false);
		context.fill();
		
		for (var i = 0; i < (this.hands).length; i++)
			(this.hands)[i].draw();	
	}
}

function Hand(len) {
	this.angle = randomBetween(0,360);
	this.speed = randomBetween(-4,5);
	if (this.speed == 0) this.speed = 1;
	this.op = 1;
	this.isLoading = false;
	this.regen = 0.01;

	this.used = function() {
		this.op = 0;
		this.isLoading = true;
	}

	this.update = function(p) {
		this.p = p;

		this.x = (this.p).x;
		this.y = (this.p).y;
		var dx = Math.cos(this.angle * (Math.PI/180)) * len;
		var dy = Math.sin(this.angle * (Math.PI/180)) * len;
		this.x += dx;
		this.y += dy;

		this.angle += this.speed;
		if (this.angle >= 360) {
			this.angle = 360 - this.angle;
		}

		if (this.isLoading) {
			this.op+=this.regen;
		}
		if (this.op >= 1) {
			this.isLoading = false;
		}

		return this;
	}

	this.draw = function() {
		context.strokeStyle = "rgba(255,255,255,0.1)";
		context.fillStyle = "rgba(255,255,255,"+this.op+")";
		
		context.beginPath();
		context.arc(this.x,this.y,5,Math.PI*2,false);
		context.fill();

		context.beginPath();
		context.moveTo((this.p).x,(this.p).y);
		context.lineTo(this.x,this.y);
		context.stroke();

		if (!this.isLoading) {
			context.strokeStyle = "rgba(255,255,255,0.5)";
			context.beginPath();
			context.arc(this.x,this.y,(this.p).radius,Math.PI*2,false);
			context.stroke();
		}
	}
}

function Border() {
	this.xgap = 50;
	this.ygap = 50;

	this.update = function() {
		return this;
	}

	this.draw = function() {
		context.strokeStyle = "#555";
		context.strokeRect(this.xgap,this.ygap,
			canvas.width-this.xgap*2,canvas.height-this.ygap*2);

		context.fillStyle = "rgba(0,0,0,1)";
		context.fillRect(this.xgap,this.ygap,
			canvas.width-this.xgap*2,canvas.height-this.ygap*2);
	}
}

function Object() {
	this.x = 1; 
	this.y = 1;

	this.update = function() {
		return this;
	}

	this.draw = function() {
		
	}
}
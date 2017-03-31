var canvaswidth=window.innerWidth;
var canvasheight=window.innerHeight;
var canvas=document.getElementById("canvas");
var context=canvas.getContext("2d");
var clipRegion={x:-1,y:-1};
var radius=50;
canvas.width=canvaswidth;
canvas.height=canvasheight;
var img=document.getElementById("blurimg");

var t="";

// $("#blurdiv").css("width",canvaswidth+"px").css("height",canvasheight+"px");
// $("#blurimg").css("width",canvaswidth+"px").css("height",canvasheight+"px");
// 
$("#blurdiv").css("width",canvaswidth+"px").css("height",canvasheight+"px");
$("#blurimg").css("width",canvaswidth+"px").css("height",canvasheight+"px");


img.onload=function(){
	initCanvas();
}

function reset(){
	initCanvas();
}

function show(){
	 t=setInterval(function(){
		clipRegion.r=clipRegion.r+20;
		if(clipRegion.r>=Math.max(canvaswidth*2,canvasheight*2)){
			clearInterval(t);
		}
		draw();
	},30);
	draw();
}

function draw(){
	context.clearRect(0,0,canvaswidth,canvasheight);
	context.save();
	setClipRegion();
	context.drawImage(img,0,0,canvaswidth,canvasheight);
	context.restore();
}

function initCanvas(){
	clearInterval(t);
	clipRegion={x:Math.random()*(canvaswidth-2*radius)+radius,
		y:Math.random()*(canvasheight-2*radius)+radius,r:radius
	};
	draw();

}

function setClipRegion(){
	context.beginPath();
	context.arc(clipRegion.x,clipRegion.y,clipRegion.r,
		0,2*Math.PI);
	context.clip();
}






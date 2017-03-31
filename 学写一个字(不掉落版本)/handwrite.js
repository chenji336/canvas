CanvasRenderingContext2D.prototype.dashedLineTo = function (fromX, fromY, toX, toY, pattern) {
 // default interval distance -> 5px
 if (typeof pattern === "undefined") {
 	pattern = 5;
 }
 // calculate the delta x and delta y
 var dx = (toX - fromX);
 var dy = (toY - fromY);
 var distance = Math.floor(Math.sqrt(dx*dx + dy*dy));
 var dashlineInteveral = (pattern <= 0) ? distance : (distance/pattern);
 var deltay = (dy/distance) * pattern;
 var deltax = (dx/distance) * pattern;

 // draw dash line
 for(var dl=0; dl< dashlineInteveral; dl++) {
 	if(dl%2) {
 		this.lineTo(fromX + dl*deltax, fromY + dl*deltay);
 	} else {    				 
 		this.moveTo(fromX + dl*deltax, fromY + dl*deltay);    				
 	}    			
 }
};

//------------------------------------------------------------------------

var canvaswidth=Math.min(800,$(window).width()-20);
var canvasheight=canvaswidth;

$("#controller").css("width",canvaswidth+"px");

var isMouseDown=false;	
var lastLoc={x:0,y:0};
var lastTime=new Date().getTime();
var lastWidth=-1;
var strokeColor="black";

var canvas=document.getElementById("canvas");
var context=canvas.getContext("2d");
canvas.width=canvaswidth;
canvas.height=canvasheight;


drawGrid();

// window.onmousedown=function(e){
// 	e.preventDefault();

// 	console.log(e.clientX+","+e.clientY);
// }
// 
function strokeStart(point){
	isMouseDown=true;
	// console.log("mousedown");
	lastTime=new Date().getTime();
	lastLoc=canvasToWindow(point.x,point.y);
}

function strokeEnd(){
	isMouseDown=false;
}

function strokeMove(point){
	if(isMouseDown){
		// console.log("mousemove");
		var curLoc=canvasToWindow(point.x,point.y);
		context.beginPath();
		context.moveTo(lastLoc.x,lastLoc.y);
		context.lineTo(curLoc.x,curLoc.y);
		var lineLength=calcLineLength(lastLoc.x,lastLoc.y,curLoc.x,curLoc.y);
		var curTime=new Date().getTime();
		var lineWidth=calcLineWidth(lineLength,curTime-lastTime);
		lastWidth=lineWidth;
		context.strokeStyle=strokeColor;
		context.lineWidth=lineWidth;
		context.lineCap="round";
		context.lineJoin="round";
		context.stroke();
		lastLoc=curLoc;
		lastTime=curTime;
	}
}

canvas.onmousedown=function(e){
	e.preventDefault();
	strokeStart({x:e.clientX,y:e.clientY});
}

canvas.onmouseup=function(e){
	e.preventDefault();
	strokeEnd();
	// console.log("mouseup");
	// console.log(canvasToWindow(e.clientX,e.clientY));
}

canvas.onmouseout=function(e){
	e.preventDefault();
	strokeEnd();
	// console.log("mouseout");
}

canvas.onmousemove=function(e){
	e.preventDefault();
	strokeMove({x:e.clientX,y:e.clientY});
}

canvas.addEventListener('touchstart',function(e){
	e.preventDefault();
	var touch=e.touches[0];
	strokeStart({x:touch.pageX,y:touch.pageY});
})

canvas.addEventListener("touchend",function(e){
	e.preventDefault();
	strokeEnd();
})

canvas.addEventListener("touchmove",function(e){
	e.preventDefault();
	var touch=e.touches[0];
	strokeMove({x:touch.pageX,y:touch.pageY});
})

document.getElementById("clear-btn").onclick=function(e){
	context.clearRect(0,0,canvaswidth,canvasheight);
	drawGrid();
}

$(".color_btn").click(function(e){
	$(".color_btn").removeClass("color_btn_selected");
	$(this).addClass("color_btn_selected");
	strokeColor=$(this).css("background-color");
})

function calcLineLength(lastX,lastY,curX,curY){
	return Math.sqrt((curX-lastX)*(curX-lastX)*+(curY-lastY)*(curY-lastY));
}

function calcLineWidth(s,t){
	var v=s/t;
	var lineWidth=0;
	if(v<=0.1)
		lineWidth=30;
	else if(v>=10)
		lineWidth=1;
	else
		lineWidth=30-(v-0.1)/(10-0.1)*(30-1)
	if(lastWidth==-1){
		return lineWidth;
	}
	
	return lastWidth*2/3+lineWidth/3;

}

function canvasToWindow(x,y){
	var rect=canvas.getBoundingClientRect();
	return {x:x-rect.left,y:y-rect.top};
}




function drawGrid(){
	context.save();
	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(canvaswidth-3,3);
	context.lineTo(canvaswidth-3,canvasheight-3);
	context.lineTo(3,canvasheight-3);
	context.closePath();
	context.lineWidth=6;
	context.strokeStyle="red";
	context.stroke();

	context.beginPath();
	//»­ÊµÏß
	// context.moveTo(0,0);
	// context.lineTo(canvaswidth,canvasheight);

	// context.moveTo(canvaswidth,0);
	// context.lineTo(0,canvasheight);
	

	// context.moveTo(canvaswidth/2,0);
	// context.lineTo(canvaswidth/2,canvasheight);

	// context.moveTo(0,canvasheight/2);
	// context.lineTo(canvaswidth,canvasheight/2);

	//ÐéÏß
	context.dashedLineTo(0,0,canvaswidth,canvasheight,5);	
	context.dashedLineTo(canvaswidth,0,0,canvasheight,5);	
	context.dashedLineTo(canvaswidth/2,0,canvaswidth/2,canvasheight,5);	
	context.dashedLineTo(0,canvasheight/2,canvaswidth,canvasheight/2,5);	
	context.closePath();
	context.lineWidth=1;
	context.strokeStyle="red";
	context.stroke();
	context.restore();

	

	
}




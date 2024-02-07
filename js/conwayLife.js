const fps = 5;
const canvas = document.getElementById('gameCanvas');
const canvasContext = canvas.getContext('2d');
var cellSize = 10;
let mouseX;
let mouseY;
let cellColor = '#222';
let cellNextColor = '#33C3F0';
var frame = makeFrame(canvas.width, canvas.height, cellSize);
var start=true;
var sketch=false;
var end=false;

window.onload = function() {
	canvas.addEventListener('mousemove',
		function(evt){
			let mousePos = mousePosition(evt);
			mouseX = mousePos.x;
			mouseY = mousePos.y;
			if (sketch){
				drawCursorCell(mouseX,mouseY);
			}
		})
	canvas.addEventListener('click',
		function(evt){
			if (!sketch){
				start=!start;
			}
			else{
				let i=Math.floor(mouseY/cellSize);
				let j=Math.floor(mouseX/cellSize);
				frame[i][j]=1-frame[i][j];
			}
		})
	
	game = setInterval(function(){
		if (end){
			clearInterval(game);
		}
		var nextFrame = makeNextFrame(frame);
		drawRect(0,0,canvas.width,canvas.height,'white');
		drawFrame(frame,cellSize,cellColor);
		firstStart=false;
		if (start){
		frame = nextFrame;
		drawFrame(nextFrame,cellSize,cellNextColor);
		}
	}, 1000/ fps);	
}

function drawRect(cornerX,cornerY,width,height,drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(cornerX,cornerY,width, height)
}

function drawCursorCell(mouseX,mouseY){
	cellX=cellSize*Math.floor(mouseX/cellSize);
	cellY=cellSize*Math.floor(mouseY/cellSize);
	drawRect(cellX,cellY,cellSize,cellSize,cellColor);
}

function mousePosition(evt){
	let rect = canvas.getBoundingClientRect();
	let root = document.documentElement;
	let mouseX = evt.clientX-rect.left-root.scrollLeft;
	let mouseY=evt.clientY-rect.top-root.scrollTop;
	return {x:mouseX,
			y:mouseY};
}

function makeFrame(width, height, cellSize,empty=false, startFrame = false){
	let random = (empty?0:1);
	let rows = height/cellSize;
	let cols = width/cellSize;
	let frameArr = [];
	if (startFrame==true){
		for(let i=0;i<rows;i++){
		frameArr[i] = [];
		for(let j=0;j<cols;j++){
			if (j%3==0){
				frameArr[i][j]=1;	
			}
			else{
				frameArr[i][j]=0
			}
			
		}
	}
	}

	for(let i=0;i<rows;i++){
		frameArr[i] = [];
		for(let j=0;j<cols;j++){
			frameArr[i][j]= Math.round(Math.random()-0.3)*random;
		}
	}
	return frameArr;
}	

function drawFrame(renderFrame,cellSize,cellColor){
	let rows = renderFrame.length;
	let cols = renderFrame[0].length;
	for (let i=0; i<rows; i++){
		for (let j=0; j<cols; j++){
			if (renderFrame[i][j] == 1){
				drawRect(j*cellSize,i*cellSize,cellSize,cellSize,cellColor);
			}
		}
	}
}

function makeNextFrame(currentFrame){
	var nextFrame = copyFrame(currentFrame);
	var neighbors = makeNeighborFrame(currentFrame);
	for (let i=0; i<currentFrame.length; i++){
		for (let j=0; j<currentFrame[0].length; j++){
			if (currentFrame[i][j]==1 & !(neighbors[i][j]==2 | neighbors[i][j]==3)){
				nextFrame[i][j]=0
			}
			if (currentFrame[i][j]==0 & neighbors[i][j]==3){
				nextFrame[i][j]=1;
			}
		}
	}
	return nextFrame;
}

function randomRestart(){
	start=false;
	sketch=false;	
	frame = makeFrame(canvas.width, canvas.height, cellSize);
}

function drawToggle(){
	var drawButton = document.getElementById("draw");

	if (drawButton.innerText=="DRAW"){
		console.log('draw pressed');
		drawButton.innerText="START";
		start=false;
		sketch=true;
		frame=makeFrame(canvas.width, canvas.height, cellSize,true);
	}
	else{
		drawButton.innerText="draw";
		sketch=false;
		start=true;
	}
}

function copyFrame(originalFrame){
	let copyFrame = []
	for (let i = 0; i < originalFrame.length; i++){
		copyFrame[i] = originalFrame[i].slice();
	}
	return copyFrame;
}

function makeNeighborFrame(cellFrame){
	let neighborFrame=makeFrame(canvas.width, canvas.height, cellSize,true);
	let rows = cellFrame.length;
	let cols = cellFrame[0].length;

	for (let i=0; i<rows; i++){
		for (let j=0; j<cols; j++){
			let sum=-frame[i][j];
			let rows=frame.length;
			let cols=frame[0].length;

			for (let x=-1;x<2;x++){
				for (let y=-1;y<2;y++){
					let row=(i+x+rows)%(rows);
					let col=(j+y+cols)%(cols);
					sum += frame[row][col];
				}
			}	
			neighborFrame[i][j]=sum;  
		}			
	}
	return neighborFrame;
}
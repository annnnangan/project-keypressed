const unitLength  = 20;
const boxColor    = 150
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;

function setup(){
	/* Set the canvas to be under the element #canvas*/
	const canvas = createCanvas(windowWidth, windowHeight - 100);
	canvas.parent(document.querySelector('#canvas'));

	/*Calculate the number of columns and rows */
	columns = floor(width  / unitLength); 
	rows    = floor(height / unitLength); 
	
	/*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
	currentBoard = [];
	nextBoard = [];
	for (let i = 0; i < columns; i++) {
		currentBoard[i] = [];
		nextBoard[i] = []
    }
	// Now both currentBoard and nextBoard are array of array of undefined values.
	init();  // Set the initial values of the currentBoard and nextBoard
}

//loop over both currentBoard and nextBoard to set all of the boxes' value to 0.
function init() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			currentBoard[i][j] = 0;
			nextBoard[i][j] = 0;
		}
	}
}

function draw() {
    background(255); //bg color 255,255,255
    generate();
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1){
                fill(boxColor);  //if the box has life, then give it a color
            } else {
                fill(255); //if no life, then bg color
            } 
            stroke(strokeColor); //stroke color
            rect(i * unitLength, j * unitLength, unitLength, unitLength); 
			//inbuilt function, x-coordinate of rectangle;y-coordinate of rectangle.;width of rectangle;height of rectangle.
        }
    }
}


//calculates the next generation with current generation.
function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if( i == 0 && j == 0 ){
	                    // the cell itself is not its own neighbor
	                    continue;
	                }
                    // The modulo operator is crucial for wrapping on the edge
					
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
					
                }
            }

            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < 2) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > 3) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

/**
 * When mouse is dragged
 */
function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
    noLoop();
    mouseDragged();
   
}

/**
 * When mouse is released
 */
function mouseReleased() {
    loop();
}


let upCount = -1



function keyPressed(){ 
    let currentX;
    let currentY;
    let previousX;
    let previousY;
    
    function mouseMoved(){  
        currentX = Math.floor(mouseX / unitLength);
        currentY = Math.floor(mouseY / unitLength);
    }

    // if(key === 'c' || key === 'C'){
    //     mouseMoved();
    //     noLoop();
    //     currentBoard[x][y] = 1;
    //     fill(boxColor);
    //     stroke(strokeColor);
    //     rect(x * unitLength, y * unitLength, unitLength, unitLength); 
    // }

    mouseMoved();

    if(previousX === undefined || previousY === undefined){
       previousX = currentX
       previousY = currentY
    }

    console.log(previousX,previousY)

 
    if(key === 'ArrowUp'){
        //when the cursor move to another cell 
        if(currentX != previousX ||currentY != previousY ){ 
            upCount = 0;
            noLoop();
            currentY = currentY + 1
            fill(boxColor)
            stroke(strokeColor);
            rect(currentX * unitLength, currentY * unitLength, unitLength, unitLength);
            previousX = currentX
            previousY = currentY
        }else if(currentX === previousX && currentY === previousY){
            upCount +=1
            noLoop();
            if(currentY-upCount > unitLength * rows ){
                upCount = 0
                alert("Exceed the board")
            }else{
                currentY = currentY - upCount
                fill(boxColor)
                stroke(strokeColor);
                rect(currentX * unitLength, currentY * unitLength, unitLength, unitLength);
                previousX = currentX
                previousY = currentY
            }
        }
    
    }

    if(key === 'Enter' ){
        loop();
    }

}



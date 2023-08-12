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


const keyboardMode = {
    isActive: false,
    currentX: undefined,
    currentY: undefined,
};

let pattern1IsActive = false
let pattern2IsActive = false
let selectPattern = false
let pattern1=`..............OO.
..............OO.
........OOO......
..........O......
.........O.....OO
..............O.O
................O
.................
.................
.................
.................
.................
.................
.................
.................
.................
.................
.O...............
.OO..............
O.O..............`
let pattern2=`OO.O.OO
...O...
O.....O
.OOOOO.
.......
.......
OOO.OOO`

document.querySelector('.pattern1').addEventListener('click', function(e){
    pattern1IsActive = true
    pattern2IsActive = false

    
})

document.querySelector('.pattern2').addEventListener('click', function(e){
    pattern1IsActive = false
    pattern2IsActive = true
   
})





function keyPressed(){

    keyboardMode.currentX = Math.floor(mouseX / unitLength);
    keyboardMode.currentY = Math.floor(mouseY / unitLength);

    if (key === "Enter") {
        loop();
    }


    if(key === "c"|| key === 'C' ){
        noLoop();
        let pattern;
        let patternArr;

        if(pattern1IsActive){
            pattern = pattern1
        }else if(pattern2IsActive){
            pattern = pattern2
        }

        console.log("pattern",pattern)

        patternArr = pattern.split("\n")
        for(let rowIdx = 0; rowIdx < patternArr.length; rowIdx++){
            for(let colIdx=0; colIdx < patternArr[rowIdx].length; colIdx++){
                let newColumn = keyboardMode.currentX + colIdx;
                let newRow = keyboardMode.currentY + rowIdx;
                if (patternArr[rowIdx][colIdx] === "O"){
                    currentBoard[newColumn][newRow] = 1;

                }else{
                    currentBoard[newColumn][newRow] = 0;
                }

                if(currentBoard[newColumn][newRow] === 1){
                    fill(boxColor);
                }else{
                    fill(255);
                }

                stroke(strokeColor);
                rect(newColumn * unitLength, newRow * unitLength, unitLength, unitLength);
            }
        }
        return;
    }

}



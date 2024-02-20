const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAME = [
    "0",
    "J",
    'T',
    'C',
    'D',
    'F',
    'E',
    'I'
]

//figures
const TETROMINOES = {
    'O': [
        [1,1],
        [1,1] 
    ],
    'J': [
        [1,0,0],
        [1, 1, 0],
        [0,0,0]
    ],
    'T': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    'C': [
        [1, 1],
        [1, 0],
        [1,1]
    ],

    'D': [
        [1]
    ],

    'F': [
        [1, 0],
        [1, 1],
        [0,1]
    ],
    'E': [
        [1, 1, 1],
        [0, 1, 0],
        [0,0,0]
    ],
    'I': [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ],
}

function convertPositionToIndex(row, column) {
    return row*PLAYFIELD_COLUMNS + column
}

let playfield; //поле
let tetromino; //фігура



//формуємо поле, де будуть рухатись фігури
function generatePlayfield() {
    for (let i = 0; i < PLAYFIELD_COLUMNS * PLAYFIELD_ROWS; i++) {
        const div = document.createElement(`div`);
        document.querySelector(".grid" ).append(div);
    }
    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
    // console.table(playfield);
}

//формуємо фігуру по параметрах
function generateTetromino() {

    //назва фігури
    const name = TETROMINO_NAME[7];
    const matrix = TETROMINOES[name]; 
    console.log(matrix);
    tetromino = {
        name,
        matrix,
        row: 2,
        column: 4
    }
}


generatePlayfield();
generateTetromino();
const cells = document.querySelectorAll('.grid div')



// видалити малюнок - додати малюнок
function drawPlayfield() { 
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] == 0) continue; //пропустити малювання
            //момент малювання
            const name = playfield[row][column];
const cellIndex = convertPositionToIndex(row, column)(
              cells[cellIndex].classList.add(name),
          )
        }
    }
}


//малювання фігури
function drawTetromino() { 
    const name = tetromino.name;
    //different size of figures
    const tetrominoMatrixSize = tetromino.matrix.length;


    for (let row = 0; row < tetrominoMatrixSize; row++) {
      for (let column = 0; column < tetrominoMatrixSize; column++) {
          if (!tetromino.matrix[row][column]) continue; 
          const cellIndex = convertPositionToIndex(
              tetromino.row + row,
              tetromino.column + column,
          )
        //   console.log(cellIndex);
          cells[cellIndex].classList.add(name);
 } // column
    }
    //row
}
// drawTetromino();
// drawPlayfield();

//почистити
function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayfield();
    drawTetromino(); 
}

draw();



//keybord
document.addEventListener('keydown', onKeyDown)
function onKeyDown(e) { 
    // console.log(e)
    switch (e.key) { 
        case'ArrowDown':
            moveTetrominoDown();
            break;
         case'ArrowLeft':
            moveTetrominoLeft();
            break;
        case'ArrowRight':
            moveTetrominoRight();
            break;
    }
    draw() 
}


//func move down
function moveTetrominoDown() {
    tetromino.row += 1;

}
function moveTetrominoLeft() {
    tetromino.column -= 1;

}
function moveTetrominoRight() {
    tetromino.column += 1;

}

/*
- додати нові фігури,
- стилізувати кожну фігуру
- додати функцію рандомну, яка повертає випадкову фігуру
- центрувати фігуру незалежно від ширини

*/ 
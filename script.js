const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAME = [
    'O',
    'J',
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
        [1, 1],
        [1, 1] 
    ],
    'J': [
        [1, 0],
        [1, 1],
        [0, 0]
    ],
    'T': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    'C': [
        [1, 1],
        [1, 0],
        [1, 1]
    ],

    'D': [
        [0, 1]
    ],

    'F': [
        [1, 0],
        [1, 1],
        [0, 1]
    ],
    'E': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
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

let playfield; //поле порожнє
let tetromino; //фігура порожня



//формуємо поле, де будуть рухатись фігури
function generatePlayfield() {
    for (let i = 0; i < PLAYFIELD_COLUMNS * PLAYFIELD_ROWS; i++) {
        const div = document.createElement(`div`);
        document.querySelector('.grid ').append(div);
    }
    //кількість рядів у полі
    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
    // console.table(playfield);
}

//формуємо фігуру по параметрах
function generateTetromino() {
    const name = TETROMINO_NAME[Math.floor(Math.random() * TETROMINO_NAME.length)];
    const matrix = TETROMINOES[name];
    const center = Math.floor((PLAYFIELD_COLUMNS - matrix[0].length) / 2);
        //актуальна фігура з якою ми працюємо
    tetromino = {
        name,
        matrix,
        row: 0,
        column: center,
    };
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    // проходимо по полю і визначаємо де додати колір, а де ні
    for (let row = 0; row < matrixSize; row++) { 
        for (let column = 0; column < matrixSize; column++) { 
            if (tetromino.matrix[row][column]) {
               playfield[tetromino.row + row][tetromino.column + column] = tetromino.name; 
            }
            
        }
    }
    generateTetromino();
}
//ГЕНЕРУЄТЬСЯ ПОЛЕ
generatePlayfield();
//СТВОРЮЄТЬСЯ ФІГУРКА
generateTetromino();


const cells = document.querySelectorAll('.grid div')


// видалити малюнок - додати малюнок -> памятає всі наші фігури
function drawPlayfield() { 
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] == 0) continue; //якщо там 0 (ми все поле наповнили нулями, пропустити малювання

            //момент малювання
            const name = playfield[row][column];
            //момент індексації поля
            const cellIndex = convertPositionToIndex(row, column)
            //додаємо класи для промальовки
            cells[cellIndex].classList.add(name);
        }
    }
}








//малювання фігури
function drawTetromino() { 
    //вибрали імя
    const name = tetromino.name;
    //dвибрали пропорції фігури
    const tetrominoMatrixSize = tetromino.matrix.length;

// проходимо циклом по параметрам фігури
    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            // результат алгоритму функції rotateMatrix()

        //     const cellIndex = convertPositionToIndex(
        //       tetromino.row + row,
        //       tetromino.column + column,
        //   )
            //   cells[cellIndex].innerHTML = showRotated[row][column];
            
            //якщо там 
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

//почистити і перемалювати
function draw() {
    //проходимся по всьому полі і видаляємо лишні класи
    cells.forEach(cell => cell.removeAttribute('class'));
    // перемальовуємо поле, щоб побачити усі фігури, які є
    drawPlayfield(); 
    drawTetromino(); 
}

//перегортання
function rotateTetromino() {
    //визначити позицію сталої фігури і перемикатись на нову

    //зберегти стару позицію
    const oldMatrix = tetromino.matrix; 

    //перевертаємо
    const rotatedMatrix = rotateMatrix(tetromino.matrix);

    //для підказки, щоб цифри перемальовувались
    // showRotated = rotateMatrix(showRotated);

    //перезаписуємо актуальний стан фігури
    tetromino.matrix = rotatedMatrix;

    //ЩОБ ФІГУРИ НЕ НАЛАЗИЛИ ОДНА НА ОДНУ - якщо не валідна матриця - повертаємо стару
    if(!isValid()){
        tetromino.matrix = oldMatrix;
    }
}
let showRotated = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]


draw();

// перегортання фігури
function rotate() {
    //виконуються розрахунки
    rotateTetromino();
    //перемальовується
    draw();

}

//клавіатура - керування та умови
document.addEventListener('keydown', onKeyDown)
function onKeyDown(e) { 
    // console.log(e)
    switch (e.key) { 
         case'ArrowUp':
            rotate();
            break;
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

// абстрактно промальовується поворот фігури
function rotateMatrix(matrixTetromino) {
    //розраховуємо довжину
    const N = matrixTetromino.length;
    //будемо зберігати новостворений масив матриці фігури
    const rotateMatrix = [];
    for (let i = 0; i < N; i++){
        rotateMatrix[i] = [];
        for (let j = 0; j < N; j++){
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }
    return rotateMatrix;
}


//func move down
function moveTetrominoDown() {
    tetromino.row += 1;
     if (!isValid()) {
         tetromino.row -= 1;  
         placeTetromino()
    }

}
function moveTetrominoLeft() {
    tetromino.column -= 1;
    //якщо виходить за край, повертаємо назад
    if (!isValid()) {
      tetromino.column += 1;  
    }
}
function moveTetrominoRight() {
    tetromino.column += 1;
    //якщо виходить за край, повертаємо назад
     if (!isValid()) {
      tetromino.column -= 1;  
    }
}
//чи валідна фігура
function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            // if (tetromino.matrix[row][column]) {
            //     continue;
            // }
            // можна рухатись чи не можна
            if (isOutSideOfGameboard(row, column)) {
                return false;
            }

            if (hasCollisions(row, column)) {
                return false;
            }
        }
    }
    return true;
}
//чи дійшла до краю фігура
function isOutSideOfGameboard(row, column) {
    return tetromino.matrix[row][column] &&
        (
            tetromino.column + column < 0 ||
            tetromino.column + column >= PLAYFIELD_COLUMNS ||
            tetromino.row + row >= PLAYFIELD_ROWS
        );
}

//
function hasCollisions(row, column) { 
    return tetromino.matrix[row][column]
        && playfield[tetromino.row + row][tetromino.column + column];
}
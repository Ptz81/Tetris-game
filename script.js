const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const scoreElement = document.querySelector('.score');
const btn = document.querySelector('.btn');
const overlay = document.querySelector('.overlay');


let playfield; //поле порожнє
let tetromino; //фігура порожня
let isGameOver = false; 
let isPaused = false;
let timedId = null; 
let score = 0;
let cells;


const TETROMINO_NAME = [
    'O',
    'J',
    'T',
    'C',
    'D',
    'F',
    'E',
    'I',
    'L',
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
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
     'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
}


init();
//функція ініціалізації гри
function init(){
    score = 0;
    scoreElement.innerHTML = 0;
    isGameOver = false;
    generatePlayfield();
    generateTetromino();
    cells = document.querySelectorAll('.grid div');
    moveDown();
}

//кнопка restart
btn.addEventListener('click', function(){
    document.querySelector('.grid').innerHTML = '';
    overlay.style.display = 'none';
    init();
})

function convertPositionToIndex(row, column) {
    return row*PLAYFIELD_COLUMNS + column
}

function getRandomElement(array){
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex];
}


//нараховуємо бали
function countScore(destroyRows){
    switch(destroyRows){
        case 1:
            score += 10;
            break;
        case 2: 
            score += 20;
                break;
        case 3: 
            score += 50;
                break;
        case 4: 
            score += 100;
                break;
    }
    scoreElement.innerHTML = score;
}

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
    const name = getRandomElement(TETROMINO_NAME);
    const matrix = TETROMINOES[name];
    const center = Math.floor((PLAYFIELD_COLUMNS - matrix[0].length) / 2);
    const rowTetro = -2;
        //актуальна фігура з якою ми працюємо
    tetromino = {
        name,
        matrix,
        row: rowTetro,
        column: center,
    };
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    // проходимо по полю і визначаємо де додати колір, а де ні
    for (let row = 0; row < matrixSize; row++) { 
        for (let column = 0; column < matrixSize; column++) { 

             if(isOutsideOfTopboard(row)){
                isGameOver = true;
                return;
            }

            if (tetromino.matrix[row][column]) {
               playfield[tetromino.row + row][tetromino.column + column] = tetromino.name; 
            }
            
        }
    }
    const filledRows = findFilledRows();
    removeFillRows(filledRows);
    generateTetromino();
    countScore(filledRows.length);
}

function removeFillRows(filledRows){
    for(let i = 0; i < filledRows.length; i++){
        const row = filledRows[i];
        dropRowsAbove(row);
    }
}


function dropRowsAbove(rowDelete){
    for(let row = rowDelete; row > 0; row--){
        playfield[row] = playfield[row - 1];
    }

    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}


function findFilledRows(){
    const fillRows = [];
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        let filledColumns = 0;
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] != 0){
                filledColumns++;
            }
        }
        // for 2
        if(PLAYFIELD_COLUMNS === filledColumns){
            fillRows.push(row);
        }
        // if
    }
    // for 1

    return fillRows;
}


//ГЕНЕРУЄТЬСЯ ПОЛЕ
// generatePlayfield();
//СТВОРЮЄТЬСЯ ФІГУРКА
// generateTetromino();





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
            if(isOutsideOfTopboard(row)) continue;
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
// let showRotated = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9]
// ]


// draw();

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
     if(e.key == 'Escape'){
        togglePauseGame();
    }
    // if Escape
    if (!isPaused) {
        switch (e.key) {
            case 'ArrowUp':
                rotate();
                break;
            case 'ArrowDown':
                moveTetrominoDown();
                break;
            case 'ArrowLeft':
                moveTetrominoLeft();
                break;
            case 'ArrowRight':
                moveTetrominoRight();
                break;
        }
    }
    draw() 
}


function isValid(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            // if(tetromino.matrix[row][column]) continue;
            if(isOutsideOfGameboard(row, column)) { return false; }
            if(hasCollisions(row, column)) { return false; }
        }
    }

    return true;
}

function isOutsideOfTopboard(row){
    return tetromino.row + row < 0;
}

function dropTetrominoDown(){
    while(isValid()){
        tetromino.row++;
    }
    tetromino.row--;
}


// абстрактно промальовується поворот фігури
function rotateMatrix(matrixTetromino) {
    //розраховуємо довжину
    const N = matrixTetromino.length;
    //будемо зберігати новостворений масив матриці фігури
    const rotateMatrix = [];
    //цикл перегортання - проходимось по масиву фігури і змінюємо положення
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
startLoop()
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
        && playfield[tetromino.row + row]?.[tetromino.column + column];
}
//рух вниз
function moveDown(){
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if(isGameOver){
        gameOver();
    }
}


function gameOver(){
    stopLoop();
    overlay.style.display = 'flex';
}

function startLoop(){
    if(!timedId){
        timedId = setTimeout(()=>{ requestAnimationFrame(moveDown) }, 700)
    }
}

function stopLoop(){
    cancelAnimationFrame(timedId);
    clearTimeout(timedId);

    timedId = null;
}


function togglePauseGame(){
    if(isPaused === false){
        stopLoop();
    } else {
        startLoop();
    }
    isPaused = !isPaused;
}

// поставити const rowTetro = -2, прописати код, щоб працювало коректно
// зверстати поле для розрахунку балів
// прописати логіку і код розрахунку балі гри (1 ряд = 10, 2 ряди = 30, 3 ряди = 50, 4 ряди =100)
// реалізувати самостійний рух фігур до низу.
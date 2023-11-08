const gameBoard = (function() {
    const size = 3;
    const gameboard = [
        [".", ".", "."],
        [".", ".", "."],
        [".", ".", "."],
    ];

    const insert = (stone, posX, posY) => {
        if(gameboard[posX][posY] !== ".")
            return false;
        else {
            gameboard[posX][posY] = stone;
            return true;
        }
    }

    const display = () => {
        for( let i = 0; i < gameboard.length; i++){
            console.log(gameboard[i]);
        }
    }

    const displayCell = (posX, posY) => {
        console.log(gameboard[posX][posY]);
    }

    const boardCopy = () => {
        const copy = gameboard;
        return copy;
    }

    const initBoard = () => {
        for( let i = 0; i < size ; i ++) {
            for ( let j = 0; j < size ; j++) {
                gameboard[i][j] = '.';
            }
        }
        const boxes = document.querySelectorAll('.box');
        boxes.forEach((box) => {
            if(box.hasChildNodes()) {
                box.removeChild(box.firstChild);
            }
        });
    }
    return { 
        insert, display, displayCell, boardCopy, initBoard, 
    }
})();

const ticTacToe = (function () {
    const turn = document.getElementById('turn');
    let turnStone;
    let gameTurn;

    const setUpListeners = () => {
        const boxes = document.querySelectorAll('.box');
        boxes.forEach((box) => {
            box.addEventListener('click', () => {
                if(gameBoard.insert(turnStone, box.dataset.row, box.dataset.column)) {
                    const img = document.createElement('img');
                    img.src = setImg();
                    box.appendChild(img);
                    check();
                    if(player2.getName !== 'IA'){
                        changeTurnStone();
                    }
                    else {
                        IAMove();
                    }
                }
            });
        });
    }

    const IAMove = () => {     
        const boxes = document.querySelectorAll('.box');
        /*Empty board*/
        if(emptyBoard()){
            gameBoard.insert(turnStone, 1, 1); // Insert in center
            const img = document.createElement('img');
            img.src = setImg();
            boxes[4].appendChild(img);
            check();
            changeTurnStone();
        }
        /*If not empty*/

    }

    const emptyBoard = () => {
        let flag = 'false';
        const board = gameBoard.boardCopy();
        for(let i = 0; i < board.length; i++){
            for( let j = 0; j < board.length; j++){
                if(board[i][j] === '.')
                    flag = 'true';
            }
        }
        return flag;
    }

    const setImg = () => {
        if(turnStone === 'O')
            return './circle.svg';     
        else 
            return './x.svg';
    }

    const changeTurnStone = () => {
        if(turnStone === 'O')
            turnStone = 'X';
        else
            turnStone = 'O';
    }
    
    const check = () => {
        let flag = winCheck();
        if(flag === 'true') {
            stopGame();
            return;
        }
        flag = drawCheck();
        if(flag === 'true'){
            stopGame();
            return;
        }
    }

    const drawCheck = () => {
        const board = gameBoard.boardCopy();
        let count = 0;
        /*Rows check*/
        for( let i = 0 ; i < board.length; i++){
            if(board[i].includes('X') && board[i].includes('O')) {
                count++;
            }
        }
        console.log('Count: '+count);
        /*Columns check*/

        for( let i = 0; i < board.length; i++) {
            let arr1 = [];
            arr1.push(board[0][i]);
            arr1.push(board[1][i]);
            arr1.push(board[2][i]);
            if(arr1.includes('X') && arr1.includes('O'))
                count++;
        }
        console.log('Count: '+count);
        /*Diagonals check*/
        let arr1 = [];
        arr1.push(board[0][0]);
        arr1.push(board[1][1]);
        arr1.push(board[2][2]);
        if(arr1.includes('X') && arr1.includes('O'))
            count++;
        let arr2 = [];
        arr2.push(board[2][0]);
        arr2.push(board[1][1]);
        arr2.push(board[0][2]);
        if(arr2.includes('X') && arr2.includes('O'))
            count++;
        if(count === 8) 
            return true;
        console.log('Count: '+count);
    }

    const winCheck = () => {
        const board = gameBoard.boardCopy();
        /*Rows check*/
        for ( let i = 0 ; i < board.length ; i++){
            if(board[i][0] !== '.') {
                if(board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                    winner(board[i][0]);
                    return 'true';
                }
            }
        }
        /*Columns check*/
        for ( let i = 0 ; i < board.length ; i++){
            if(board[0][i] !== '.') {
                if(board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                    winner(board[0][i]);
                    return 'true';
                }
            }
        } 
        /*Diagonals check*/
        if(board[1][1] !== '.') {
            if(board[0][0] === board[1][1] && board[1][1] === board[2][2] || board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
                winner(board[1][1]); 
                return 'true'
            }
        }
    }

    const stopGame = () => {
        const board = document.querySelectorAll('.box');
        board.forEach((box) => {
            if(!box.hasChildNodes()) {
                if(gameBoard.insert('-', box.dataset.row, box.dataset.column)) {
                const blocked = document.createElement('img');
                blocked.src = './x-circle.svg';
                box.appendChild(blocked);
                }           
            }
        });
    }



    const winner = (stone) => {
        const winner = document.getElementById('winner');
        if(stone === 'X')
         winner.innerHTML = `The winner is ${player1.getName()}!!`;
        else
         winner.innerHTML = `The winner is ${player2.getName()}!!`;
    }

    const gameStart = (player1, player2) => {
        this.player1 = player1;
        this.player2 = player2;
        gameBoard.initBoard();
        gameTurn = Math.floor(Math.random()*2)+1
        turn.innerHTML = `Player ${gameTurn}`;
        if(gameTurn === 1) 
            turnStone = 'O';
        else
            turnStone = 'X';
        setUpListeners();
        if((player2.getName() === 'IA') && (turnStone === 'X'))
            IAMove();
    }

    return {
        check, gameStart,
    }
})();

const Player = (name, stone) => {
    const getName = () => name;
    const getStone = () => stone;

    return { getName, getStone };
}

const player1 = Player('Kimba');
const player2 = Player('Gordo');
const player3 = Player('IA')
const playBtn = document.getElementById('play');

playBtn.addEventListener('click', () => {
    ticTacToe.gameStart(player1, player2);
});
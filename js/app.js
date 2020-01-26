// wait for the site to be loaded
window.addEventListener('DOMContentLoaded', (event) => {
    let gameGrid;
    // add click listener to game-grid
    gameGrid = document.querySelector(boardData.gamegridIdSelector);
    console.log(gameGrid);
    gameGrid.addEventListener('click', gameGridClickListener);

    // add click listener to reset button
    document.querySelector(boardData.resetButtonClassSelector).addEventListener('click', resetGameButtonHandler);

    // initialize game
    initGame();
});

// holds information about the board itself
let boardData = {
    gamegridIdSelector: "#game-grid",
    resetButtonClassSelector: ".reset",
    tileClassName: "span",
    tileClassSelector: ".span"
}

// player clicked reset button
let resetGameButtonHandler = function() {
    console.log('Reset button clicked');
    // clear the visuals
    resetGameBoard();
};

// reset the game
let resetGameBoard = function() {
    // loop through the tiles to clear the visuals 
    let gameBoardTiles = document.querySelectorAll(boardData.tileClassSelector);
    for (let item of gameBoardTiles) {
        item.className = "";
        item.classList.add(boardData.tileClassName);
    }

    // initialize new game
    initGame();
}

// initialize/reset game
let initGame = function() {
    preparePlayerForNewRound();
};

// some player clicked a tile
let gameGridClickListener = function(event) {
    // local variables
    let clickedElement;
    let clickedTile;

    // what was clicked?
    clickedElement = event.target.id;

    // check if relevant id was clicked (numeric)
    if (!clickedElement.match(/[0-9]/g))
    {
        return
    }
    console.log('A relevant div was clicked');

    // check if this div is already occupied
    clickedTile = event.target.querySelector(boardData.tileClassSelector);
    if (clickedTile.classList.length > 1) 
    {
        return;
    }

    console.log('The div is free');

    // current playerObject can take over
    playerContract.computeTurn(clickedElement, clickedTile);
    //playerContract.setSpan(clickedSpan);
    
    console.log(clickedTile.classList);

    // next players turn
    changeCurrentPlayer();
};

// passthrough function to maintain readability 
let changeCurrentPlayer = function() {
    playerContract.changeCurrentPlayer();
};

let preparePlayerForNewRound = function() {
    playerContract.currentPlayer = player1;
    // tell playerContract to reset 
    playerContract.resetValues();

};

// player relevant objects
let player1 = {
    name: "player1",
    symbol: "x"
};

let player2 = {
    name: "player2",
    symbol: "o"
};

let playerContract = {
    currentPlayer: player2,
    gameBoardState: new Array(9),
    changeCurrentPlayer: function() {
        if (this.currentPlayer === player1) 
        {
            this.currentPlayer = player2;
        }
        else
        {
            this.currentPlayer = player1;
        }
    },
    computeTurn: function(clickedElementIndex, clickedTile) {
        // change the visual of the clicked tile
        this.setPlayerTile(clickedTile);
        // mirror the current state of the board
        this.gameBoardState[clickedElementIndex] = this.currentPlayer.symbol;
        // check for a win condition
        checkForWin(this.gameBoardState, clickedElementIndex, this.currentPlayer);
        console.log(this.gameBoardState);
    },
    resetValues: function() {
        console.log("resetting playerContract");
        this.gameBoardState.length = 0;
    },
    setPlayerTile: function(clickedTile) {
        clickedTile.classList.add(this.currentPlayer.name);
    }
}

// check if the active player won the game
let checkForWin = function(gameBoardState, index, player) {
    console.log(`called with ${player.name}, index: ${index} data: ${gameBoardState}`);
    // rowSum represents the sum of a players symbol in that row,
    // colSum represents the sum of a players szmbol in that column,
    // rowIndex defines where to start in the given array for the row and has to be incremented by 1,
    // colIndex defines where to start in the given array for the column ans has to be incremented by 3
    let rowSum = 0, colSum = 0, rowIndex = 0, colIndex = 0;
    let rowToCheck = Math.floor(index / 3);
    let colToCheck = index % 3;

    rowIndex = rowToCheck;
    colIndex = colToCheck;
    
    console.log(`checking row: ${rowToCheck} and column: ${colToCheck}`);

    // check if there are three in a row / column
    for (let i = 0; i < 3; i++) 
    {
        if(gameBoardState[rowIndex] === player.symbol)
        {
            rowSum++;
        }
        if(gameBoardState[colIndex] === player.symbol)
        {
            colSum++;
        }
        // increment values
        rowIndex++;
        colIndex+=3;
    }
    if(colSum > 2 || rowSum > 2)
    {
        console.log(`WINNER ${player.name} won the game!`);
    } 
}
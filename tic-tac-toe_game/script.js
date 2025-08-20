const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status-text');
const resetBtn = document.getElementById('reset');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function handleClick(e) {
    const index = e.target.dataset.index;

    // Block invalid clicks
    if (board[index] !== "" || !gameActive) return;

    // Place mark
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add("taken");

    // Check for win
    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    // Check for tie
    if (!board.includes("")) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    return winningCombinations.some(combo => {
        return combo.every(index => board[index] === currentPlayer);
    });
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "Player X's turn";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("taken");
    });
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);

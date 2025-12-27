const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const strike = document.getElementById("strike");
const boardEl = document.getElementById("board");
const confettiLayer = document.getElementById("confetti-layer");

let currentPlayer = "X";
let gameActive = true;
let board = Array(9).fill("");

const wins = [
    { combo: [0,1,2], type: "row", index: 0 },
    { combo: [3,4,5], type: "row", index: 1 },
    { combo: [6,7,8], type: "row", index: 2 },
    { combo: [0,3,6], type: "col", index: 0 },
    { combo: [1,4,7], type: "col", index: 1 },
    { combo: [2,5,8], type: "col", index: 2 },
    { combo: [0,4,8], type: "diag", index: 0 },
    { combo: [2,4,6], type: "diag", index: 1 }
];

cells.forEach(cell => cell.addEventListener("click", handleClick));
resetBtn.addEventListener("click", resetGame);

function handleClick() {
    const index = this.dataset.index;
    if (board[index] || !gameActive) return;

    board[index] = currentPlayer;
    this.textContent = currentPlayer;
    this.classList.add(currentPlayer);

    checkResult();
}

function checkResult() {
    for (let win of wins) {
        const [a, b, c] = win.combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            statusText.textContent = `Player ${currentPlayer} wins!`;
            showStrike(win);
            blastConfetti();
            return;
        }
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function showStrike(win) {
    const boardSize = boardEl.offsetWidth;
    const cellSize = boardSize / 3;
    const center = cellSize / 2;

    strike.className = "strike show";
    strike.style.color = currentPlayer === "X" ? "#3dfbff" : "#ff5ad9";
    strike.style.transform = "";

    if (win.type === "row") {
        strike.style.width = `${boardSize}px`;
        strike.style.left = "0";
        strike.style.top = `${win.index * cellSize + center}px`;
    }

    if (win.type === "col") {
        strike.style.height = `${boardSize}px`;
        strike.style.width = "4px";
        strike.style.top = "0";
        strike.style.left = `${win.index * cellSize + center}px`;
    }

    if (win.type === "diag") {
        strike.style.width = `${boardSize * 1.05}px`;
        strike.style.left = "-5px";
        strike.style.top = `${boardSize / 2}px`;
        strike.style.transform = win.index === 0 ? "rotate(45deg)" : "rotate(-45deg)";
    }
}

function blastConfetti() {
    const rect = boardEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const colors = ["#3dfbff", "#ff5ad9", "#ffd93d", "#7cff00"];

    for (let i = 0; i < 80; i++) {
        const c = document.createElement("div");
        c.classList.add("confetti");
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.left = `${originX}px`;
        c.style.top = `${originY}px`;
        c.style.setProperty("--x-end", `${(Math.random() - 0.5) * 400}px`);
        c.style.animationDuration = `${2 + Math.random() * 2}s`;
        confettiLayer.appendChild(c);
    }
}

function resetGame() {
    board.fill("");
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "Player X's turn";

    strike.className = "strike";
    strike.style.transform = "";
    confettiLayer.innerHTML = "";

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("X", "O");
    });
}

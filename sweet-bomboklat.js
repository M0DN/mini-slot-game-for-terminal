const readline = require('readline');

const symbols = ['🍒', '🍇', '🍉', '🍌', '🍍', '🍋'];
const values = {
  '🍒': 1.5,
  '🍇': 3,
  '🍉': 5,
  '🍌': 4,
  '🍍': 6,
  '🍋': 8
};

const rows = 4;
const cols = 4;
let grid = [];
let totalScore = 0;

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function generateGrid() {
  grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(randomSymbol());
    }
    grid.push(row);
  }
}

function drawGrid() {
  console.clear();
  console.log('🍭 SWEET BOMBOKLATTANZA 🍭');
  console.log(`🎯 Punteggio Totale: ${totalScore}`);
  console.log('Premi INVIO per girare!\n');
  grid.forEach(row => {
    console.log(row.join(' '));
  });
}

function countSymbols() {
  const counts = {};
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const sym = grid[i][j];
      counts[sym] = (counts[sym] || 0) + 1;
    }
  }
  return counts;
}

function checkWin() {
  const counts = countSymbols();
  let win = false;
  for (const sym in counts) {
    if (counts[sym] >= 8) {
      const earned = (counts[sym] - 7) * values[sym];
      totalScore += earned;
      console.log(`\n🎉 Vittoria! ${counts[sym]} simboli ${sym} -> +${earned} punti`);
      win = true;
    }
  }
  if (!win) {
    console.log('\n😢 Nessuna vincita. Riprova!');
  }
}

function startGame() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function playRound() {
    generateGrid();
    drawGrid();
    checkWin();
    
  }

  rl.on('line', () => {
    playRound();
  });

  playRound();
}

startGame();

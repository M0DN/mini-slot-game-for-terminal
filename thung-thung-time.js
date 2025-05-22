const readline = require('readline');

// Settori e probabilità base
const sectors = [
  { value: '1', count: 21, payout: 1 },
  { value: '2', count: 13, payout: 2 },
  { value: '5', count: 7, payout: 5 },
  { value: '10', count: 4, payout: 10 },
  { value: '20', count: 2, payout: 20 },
  { value: 'Crazy', count: 1, payout: 50 }
];

// Ruota visuale (12 posizioni fisse)
const visualWheel = ['20','1️', '2️', '5️', '10', '2️', '1️', '🌀', '1️', '10', '2️', '5️', '1️','20'];
const visualValues = ['20','1', '2', '5', '10', '2', '1', 'Crazy', '1', '10', '2', '5', '1','20'];

// Stato
let balance = 100;
let totalPoints = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function applyMultiplier() {
  const chosen = sectors[getRandomInt(0, sectors.length - 1)];
  const multiplier = getRandomInt(2, 5);
  chosen._bonusMultiplier = multiplier;
  return { sector: chosen.value, multiplier };
}

function spinWheelAnimated(callback) {
  let position = 0;
  let spins = 0;
  const totalSpins = getRandomInt(30, 50);

  const spinInterval = setInterval(() => {
    console.clear();
    console.log('🎰 CRAZY TIME TERMINAL 🎰');
    console.log(`💰 Saldo: €${balance} | 🧮 Punti totali: ${totalPoints}`);
    console.log('\n🎡 Ruota in movimento...');

    const display = visualWheel.map((e, i) =>
      i === position ? `👉 ${e}` : `   ${e}`
    ).join(' ');
    console.log('\n' + display + '\n');

    position = (position + 1) % visualWheel.length;
    spins++;

    if (spins >= totalSpins) {
      clearInterval(spinInterval);
      const selectedValue = visualValues[(position - 1 + visualWheel.length) % visualWheel.length];
      const result = sectors.find(s => s.value === selectedValue);
      setTimeout(() => callback(result), 500);
    }
  }, 100);
}

function showBonusGame(callback) {
  console.log(`\n🎉 BONUS GAME: CRAZY TIME! 🎉`);
  console.log('Scegli un simbolo: 🟥  🟩  🟦');

  const rewards = [
    getRandomInt(10, 50),
    getRandomInt(20, 100),
    getRandomInt(5, 40)
  ];

  const rlBonus = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rlBonus.question('Scegli uno (rosso, verde, blu): ', (choice) => {
    const input = choice.trim().toLowerCase();
    const options = ['rosso', 'verde', 'blu'];
    let index = options.indexOf(input);
    if (index === -1) {
      index = getRandomInt(0, 2);
      console.log(`Scelta non valida. Selezionato casualmente: ${options[index]}`);
    }

    const win = rewards[index];
    balance += win;
    totalPoints += win;
    console.log(`🎊 Hai vinto ${win} punti bonus con il simbolo ${options[index]}!`);
    rlBonus.close();
    callback();
  });
}

function gameLoop() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function playRound() {
    // Reset moltiplicatori
    sectors.forEach(s => delete s._bonusMultiplier);

    const { sector: boostedSector, multiplier } = applyMultiplier();

    console.clear();
    console.log('🎰 THUNG THUNG TIME 🎰');
    console.log(`💰 Saldo: €${balance} | 🧮 Punti totali: ${totalPoints}`);
    console.log(`🎯 Moltiplicatore attivo: x${multiplier} su [${boostedSector}]`);

    rl.question('\nSu quale settore vuoi puntare? (1, 2, 5, 10, 20, Crazy): ', (sectorChoice) => {
      sectorChoice = sectorChoice.trim();
      const selectedSector = sectors.find(s => s.value.toLowerCase() === sectorChoice.toLowerCase());
      if (!selectedSector) {
        console.log('❌ Settore non valido.');
        return playRound();
      }

      rl.question('Quanto vuoi puntare? €', (amount) => {
        const bet = parseInt(amount);
        if (isNaN(bet) || bet <= 0 || bet > balance) {
          console.log('❌ Puntata non valida.');
          return playRound();
        }

        // Esegui ruota animata
        spinWheelAnimated((spin) => {
          const payout = spin.payout;
          const boosted = (spin.value === boostedSector) ? multiplier : 1;

          console.log(`\n🎡 La ruota si è fermata su: [${spin.value}]`);

          if (spin.value.toLowerCase() === sectorChoice.toLowerCase()) {
            const win = bet * payout * boosted;
            balance += win;
            totalPoints += win;
            console.log(`✅ Hai vinto €${win} (x${payout} x${boosted})!`);

            if (spin.value === 'Crazy') {
              showBonusGame(() => continuePrompt());
            } else {
              continuePrompt();
            }
          } else {
            balance -= bet;
            console.log('😢 Peccato! Hai perso la puntata.');
            continuePrompt();
          }
        });
      });
    });
  }

  function continuePrompt() {
    if (balance <= 0) {
      console.log('\n💥 Hai finito i soldi! Game Over.');
      rl.close();
      return;
    }

    rl.question('\nVuoi continuare? (s/n): ', (ans) => {
      if (ans.toLowerCase() === 's') {
        playRound();
      } else {
        console.log(`\nGrazie per aver giocato! 💰 Saldo finale: €${balance}, 🧮 Punti: ${totalPoints}`);
        rl.close();
      }
    });
  }

  playRound();
}

gameLoop();

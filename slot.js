
const prompts = require('prompts');

const symbols = ['🍒', '🍋', '🔔', '🍀', '🌈','🌷',];
const reelLength = 4;
let credits = 250;

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function spinReel() {
    const reel = [];
    for (let i = 0; i < reelLength; i++) {
        reel.push(getRandomSymbol());
    }
    return reel;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function printReel(reel) {
    const output = reel.join(' | ');
    process.stdout.write(`\r[ ${output} ]`);
}

function calculateWinnings(reel, bet) {
    if (reel.every(s => s === reel[0])) {
        if (reel[0] === '🍀') return bet * 10;
        return bet * 5;
    } else if (new Set(reel).size === 5) {
        return bet * 5;
    }
    return 0;
}

async function spinMachine(bet) {
    let finalReel;

    for (let i = 0; i < 40; i++) {
        const reel = spinReel();
        printReel(reel);
        await delay(15 + i);
        finalReel = reel;
    }

    console.log('\n');
    return finalReel;
}

async function gameLoop() {
    console.clear();
    console.log("🎰 Benvenuto 🎰");
    console.log(`Hai ${credits} crediti.`);

    while (credits > 0) {
        const { bet } = await prompts({
            type: 'number',
            name: 'bet',
            message: `Quanto vuoi scommettere?`,
            validate: value => value > 0 && value <= credits ? true : `Scommessa non valida (Hai ${credits})`
        });

        credits -= bet;

        console.log(`\n🎲 Gira la ruota per ${bet} crediti...`);
        const result = await spinMachine(bet);
        const winnings = calculateWinnings(result, bet);

        if (winnings > 0) {
            console.log(`🎉 Hai vinto ${winnings} crediti! 🎉`);
            credits += winnings;
        } else {
            console.log(`💀 Niente fortuna stavolta.`);
        }

        console.log(`Crediti attuali: ${credits}\n`);

        if (credits === 0) {
            console.log("❌ Hai finito i crediti. Game over.");
            break;
        }

        const { again } = await prompts({
            type: 'confirm',
            name: 'again',
            message: 'Vuoi giocare ancora?',
            initial: true
        });

        if (!again) {
            console.log(`🏁 Hai terminato con ${credits} crediti. Grazie per aver giocato!`);
            break;
        }

        console.clear();
    }
}

gameLoop();

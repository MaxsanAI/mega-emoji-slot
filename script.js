const reels = [];
for (let r = 1; r <= 3; r++) {
  for (let c = 1; c <= 5; c++) {
    reels.push(document.getElementById(`r${r}c${c}`));
  }
}

const spinBtn = document.querySelector('.spin-btn');
const creditDisplay = document.getElementById('credit-count');
const betDisplay = document.getElementById('bet-value');
const linesDisplay = document.getElementById('lines-value');
let credits = 1000;
let betPerLine = 1;
let lines = 1;

const symbols = ['🍒','🍋','🍊','🍉','⭐','💎','7️⃣'];

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function spinReels() {
  if (credits < betPerLine * lines) { alert("Not enough credits!"); return; }
  credits -= betPerLine * lines;
  creditDisplay.textContent = credits;

  // ukloni prethodne klase win
  reels.forEach(r => r.classList.remove('win'));

  // Spin animacija
  reels.forEach((reel, index) => {
    reel.classList.add('spin');
    setTimeout(() => {
      reel.textContent = randomSymbol();
      reel.classList.remove('spin');
    }, 100 + index * 100);
  });

  // Provera dobitka nakon animacije
  setTimeout(() => {
    // samo horizontalne linije za sada
    let win = 0;
    for (let r = 0; r < 3; r++) {
      const firstSymbol = document.getElementById(`r${r+1}c1`).textContent;
      let isWin = true;
      for (let c = 1; c <= lines; c++) {
        if (document.getElementById(`r${r+1}c${c}`).textContent !== firstSymbol) isWin = false;
      }
      if (isWin) {
        win += betPerLine * lines * 2;
        for (let c = 1; c <= lines; c++) {
          document.getElementById(`r${r+1}c${c}`).classList.add('win');
        }
      }
    }
    credits += win;
    creditDisplay.textContent = credits;
    document.querySelector('.result').textContent = win ? `You won ${win}! 🎉` : '';
  }, 1000);
}

// Bet adjust
document.getElementById('bet-minus').addEventListener('click', () => { if(betPerLine>1) betPerLine--; betDisplay.textContent = betPerLine; });
document.getElementById('bet-plus').addEventListener('click', () => { betPerLine++; betDisplay.textContent = betPerLine; });

// Lines adjust
document.getElementById('lines-minus').addEventListener('click', () => { if(lines>1) lines--; linesDisplay.textContent = lines; });
document.getElementById('lines-plus').addEventListener('click', () => { if(lines<5) lines++; linesDisplay.textContent = lines; }); // max 5

// Watch ad button adds credits
document.getElementById('watch-ad').addEventListener('click', () => {
  credits += 100;
  creditDisplay.textContent = credits;
  alert("Credits added! 🎁");
});

spinBtn.addEventListener('click', spinReels);

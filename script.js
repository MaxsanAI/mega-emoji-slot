let credits = parseInt(localStorage.getItem("credits")) || 1000;
let bet = 1;
const creditCount = document.getElementById("credit-count");
const betValue = document.getElementById("bet-value");
updateCredits();

const reels = document.querySelectorAll(".reel");
const emojiSymbols = ["🍒","🍋","🍊","🍉","🍇","🍓","🍌","⭐","🔔","💎","💰","🎲","🎰","🍀","😎","😂","🔥","🎵","⚡","💖"];
const paylines = [
  [0,0,0,0,0], // top row
  [1,1,1,1,1], // middle row
  [2,2,2,2,2], // bottom row
  [0,1,2,1,0], // V shape
  [2,1,0,1,2], // inverted V
  [0,0,1,0,0],
  [2,2,1,2,2],
  [0,1,0,1,0],
  [2,1,2,1,2],
  [1,0,1,2,1],
  [1,2,1,0,1],
  [0,1,1,1,0],
  [2,1,1,1,2],
  [0,1,2,2,2],
  [2,1,0,0,0],
  [0,0,1,2,2],
  [2,2,1,0,0],
  [1,1,0,1,1],
  [1,1,2,1,1],
  [0,1,2,1,2]
];

function updateCredits() {
  creditCount.textContent = credits;
  betValue.textContent = bet;
  localStorage.setItem("credits", credits);
}

// Bet buttons
document.getElementById("bet-minus").addEventListener("click",()=>{if(bet>1) bet--; updateCredits();});
document.getElementById("bet-plus").addEventListener("click",()=>{if(bet<20 && bet<=credits) bet++; updateCredits();});

function spinMega() {
  if(credits<bet){ alert("Not enough credits! Watch an ad for bonus 🎁"); return; }
  credits-=bet;
  updateCredits();

  // Generate reels
  const reelResult = [];
  reels.forEach(reel=>{
    reel.innerHTML="";
    const symbols = [];
    for(let i=0;i<3;i++){
      const sym = emojiSymbols[Math.floor(Math.random()*emojiSymbols.length)];
      symbols.push(sym);
      const div = document.createElement("div");
      div.className="symbol";
      div.textContent=sym;
      reel.appendChild(div);
    }
    reelResult.push(symbols);
  });

  // Animate spin
  reels.forEach(reel=>{
    const children = Array.from(reel.children);
    children.forEach((c,i)=>{
      c.style.transform="translateY(-60px)";
      setTimeout(()=>c.style.transform="translateY(0)", i*50);
    });
  });

  setTimeout(()=>checkWin(reelResult), 400);
}

function checkWin(grid){
  let win=false;
  let totalWin=0;

  paylines.forEach(line=>{
    let first = grid[0][line[0]];
    let matchCount=1;
    for(let i=1;i<5;i++){
      if(grid[i][line[i]]===first) matchCount++;
      else break;
    }
    if(matchCount>=3){
      win=true;
      totalWin += bet*matchCount*5; // payout formula
    }
  });

  const resultDiv = document.querySelector(".result");
  if(win){
    credits+=totalWin;
    resultDiv.textContent=`🎉 BIG WIN +${totalWin} credits!`;
    resultDiv.style.color="#ffd700";
    reels.forEach(r=>Array.from(r.children).forEach(s=>s.style.transform="scale(1.3)"));
    setTimeout(()=>reels.forEach(r=>Array.from(r.children).forEach(s=>s.style.transform="scale(1)")),300);
  } else{
    resultDiv.textContent="💔 Try Again!";
    resultDiv.style.color="#fff";
  }
  updateCredits();
}

document.querySelector(".spin-btn").addEventListener("click", spinMega);
document.getElementById("watch-ad").addEventListener("click",()=>{
  alert("Ad watched! Credits restored to 1000 🎁");
  credits=1000;
  updateCredits();
});

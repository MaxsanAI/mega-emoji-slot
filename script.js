let credits = parseInt(localStorage.getItem("credits")) || 1000;
let bet = 1;
const creditCount = document.getElementById("credit-count");
const betValue = document.getElementById("bet-value");
updateCredits();

const reels = document.querySelectorAll(".reel");
const paylinesOverlay = document.getElementById("paylines");
const emojiSymbols = ["🍒","🍋","🍊","🍉","🍇","🍓","🍌","⭐","🔔","💎","💰","🎲","🎰","🍀","😎","😂","🔥","🎵","⚡","💖"];

const paylines = [
  [0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],
  [0,1,2,1,0],[2,1,0,1,2],[0,0,1,0,0],
  [2,2,1,2,2],[0,1,0,1,0],[2,1,2,1,2],
  [1,0,1,2,1],[1,2,1,0,1],[0,1,1,1,0],
  [2,1,1,1,2],[0,1,2,2,2],[2,1,0,0,0],
  [0,0,1,2,2],[2,2,1,0,0],[1,1,0,1,1],
  [1,1,2,1,1],[0,1,2,1,2]
];

function updateCredits() {
  creditCount.textContent = credits;
  betValue.textContent = bet;
  localStorage.setItem("credits", credits);
}

// Bet buttons
document.getElementById("bet-minus").addEventListener("click",()=>{if(bet>1) bet--; updateCredits();});
document.getElementById("bet-plus").addEventListener("click",()=>{if(bet<20 && bet<=credits) bet++; updateCredits();});

// Create spin animation
function spinMega() {
  if(credits<bet){ alert("Not enough credits! Watch an ad!"); return; }
  credits-=bet; updateCredits();

  const reelResult=[];
  reels.forEach(reel=>{
    reel.innerHTML="";
    const symbols=[];
    for(let i=0;i<3;i++){
      const sym = emojiSymbols[Math.floor(Math.random()*emojiSymbols.length)];
      symbols.push(sym);
      const div=document.createElement("div");
      div.className="symbol"; div.textContent=sym;
      reel.appendChild(div);
    }
    reelResult.push(symbols);
  });

  // Animate reels
  reels.forEach((reel,i)=>{
    const children=Array.from(reel.children);
    children.forEach((c,j)=>{
      c.style.transform="translateY(-90px)";
      setTimeout(()=>c.style.transform="translateY(0)", i*200+j*80);
    });
  });

  setTimeout(()=>checkWin(reelResult), 1200);
}

// Check paylines
function checkWin(grid){
  let win=false, totalWin=0;
  paylines.forEach(line=>{
    let first=grid[0][line[0]]; let matchCount=1;
    for(let i=1;i<5;i++){
      if(grid[i][line[i]]===first) matchCount++;
      else break;
    }
    if(matchCount>=3){
      win=true; totalWin += bet*matchCount*5;
      // Highlight winning symbols
      for(let i=0;i<matchCount;i++){
        const symDiv = reels[i].children[line[i]];
        symDiv.style.transform="scale(1.4)";
        symDiv.style.filter="drop-shadow(0 0 10px gold)";
        setTimeout(()=>{ symDiv.style.transform="scale(1)"; symDiv.style.filter=""; },500);
      }
    }
  });

  const resultDiv=document.querySelector(".result");
  if(win){ credits+=totalWin; resultDiv.textContent=`🎉 BIG WIN +${totalWin} credits!`; resultDiv.style.color="#ffd700"; }
  else{ resultDiv.textContent="💔 Try Again!"; resultDiv.style.color="#fff"; }
  updateCredits();
}

document.querySelector(".spin-btn").addEventListener("click", spinMega);

// Ad simulation resets credits
document.getElementById("watch-ad").addEventListener("click",()=>{
  alert("Ad watched! Credits reset to 1000 🎁");
  credits=1000; updateCredits();
});

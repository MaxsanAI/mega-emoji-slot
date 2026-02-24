let credits = parseInt(localStorage.getItem("credits")) || 100;
const creditCount = document.getElementById("credit-count");

function updateCredits() {
  creditCount.textContent = credits;
  localStorage.setItem("credits", credits);
}

updateCredits();

// Mega emoji mix
const emojiSymbols = [
  "🍒","🍋","🍊","🍉","🍇","🍓","🍌",
  "⭐","🔔","💎","💰","🎲","🎰","🍀",
  "😎","😂","🔥","🎵","⚡","💖"
];

function spinMega() {
  if(credits <= 0){
    alert("No more credits! Watch an ad for bonus 🎁");
    return;
  }

  credits--;
  updateCredits();

  const reels = document.querySelectorAll("#mega-slot .reel");
  const resultDiv = document.querySelector("#mega-slot .result");
  let spinResult = [];

  reels.forEach((reel, i) => {
    // Spin animation
    let spins = 10 + Math.floor(Math.random()*10);
    let index = 0;
    for(let j=0;j<spins;j++){
      setTimeout(()=>{
        reel.textContent = emojiSymbols[Math.floor(Math.random()*emojiSymbols.length)];
      }, j*50);
      if(j===spins-1){
        index = Math.floor(Math.random()*emojiSymbols.length);
      }
    }
    spinResult.push(emojiSymbols[index]);
  });

  setTimeout(()=>{
    // Check win: 3 or more consecutive matching symbols
    let win = false;
    let count = 1;
    for(let i=1;i<spinResult.length;i++){
      if(spinResult[i]===spinResult[i-1]){
        count++;
        if(count>=3){
          win = true;
          break;
        }
      } else count=1;
    }

    if(win){
      const winAmount = 25;
      credits += winAmount;
      resultDiv.textContent = `🎉 BIG WIN +${winAmount} credits!`;
      resultDiv.style.color = "#ffd700";
      // Blink effect
      reels.forEach(r => r.style.transform="scale(1.3)");
      setTimeout(()=>reels.forEach(r=>r.style.transform="scale(1)"), 300);
    } else {
      resultDiv.textContent = "💔 Try Again!";
      resultDiv.style.color = "#fff";
    }

    updateCredits();
  }, 600);
}

// Spin button
document.querySelector(".spin-btn").addEventListener("click", spinMega);

// Rewarded ad simulation
document.getElementById("watch-ad").addEventListener("click", () => {
  alert("Simulated AdMob rewarded ad! +20 credits 🎁");
  credits += 20;
  updateCredits();
});

// Reset credits
document.getElementById("reset-credits").addEventListener("click", () => {
  credits = 100;
  updateCredits();
});

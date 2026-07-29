// ============================================================
//  🎮  MINI-GAMES
//  A different game is featured each day (same for everyone),
//  so the daily leaderboard is a fair fight.
//
//  Each game is an object:
//    { key, name, blurb, play(root, onDone) }
//  - `root`   = a container div to draw the game into
//  - `onDone` = call it with a number score when finished.
//               HIGHER IS ALWAYS BETTER (keeps the board simple).
//  Add your own by copying one of these and pushing it to GAMES.
// ============================================================

// ---------- helpers ----------
function el(html) {
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  return d.firstElementChild;
}
function clear(root) { root.innerHTML = ""; }

// ---------- 1) Quick Math: most correct in 20 seconds ----------
const quickMath = {
  key: "quick-math",
  name: "Quick Math",
  blurb: "Solve as many as you can in 20 seconds.",
  play(root, onDone) {
    clear(root);
    let score = 0, timeLeft = 20, a, b, op, answer;
    const ui = el(`
      <div class="game">
        <div class="game-top"><span class="game-timer">⏱ 20</span><span class="game-score">Solved: 0</span></div>
        <div class="game-prompt">…</div>
        <input class="game-input" inputmode="numeric" placeholder="answer" autocomplete="off" />
        <div class="game-hint">Type the answer, press Enter</div>
      </div>`);
    root.appendChild(ui);
    const timerEl = ui.querySelector(".game-timer");
    const scoreEl = ui.querySelector(".game-score");
    const promptEl = ui.querySelector(".game-prompt");
    const input = ui.querySelector(".game-input");

    function nextProblem() {
      a = 2 + Math.floor(Math.random() * 12);
      b = 2 + Math.floor(Math.random() * 12);
      op = ["+", "−", "×"][Math.floor(Math.random() * 3)];
      answer = op === "+" ? a + b : op === "−" ? a - b : a * b;
      promptEl.textContent = `${a} ${op} ${b} = ?`;
      input.value = "";
      input.focus();
    }
    input.addEventListener("input", () => {
      if (parseInt(input.value, 10) === answer) {
        score++; scoreEl.textContent = "Solved: " + score; nextProblem();
      }
    });
    nextProblem();
    const t = setInterval(() => {
      timeLeft--; timerEl.textContent = "⏱ " + timeLeft;
      if (timeLeft <= 0) { clearInterval(t); input.disabled = true; onDone(score); }
    }, 1000);
  },
};

// ---------- 2) Tap Frenzy: most taps in 5 seconds ----------
const tapFrenzy = {
  key: "tap-frenzy",
  name: "Tap Frenzy",
  blurb: "Tap the button as fast as you can for 5 seconds.",
  play(root, onDone) {
    clear(root);
    let taps = 0, started = false;
    const ui = el(`
      <div class="game">
        <div class="game-top"><span class="game-timer">⏱ 5.0</span><span class="game-score">Taps: 0</span></div>
        <button class="tap-btn">TAP!</button>
        <div class="game-hint">First tap starts the clock</div>
      </div>`);
    root.appendChild(ui);
    const timerEl = ui.querySelector(".game-timer");
    const scoreEl = ui.querySelector(".game-score");
    const btn = ui.querySelector(".tap-btn");

    btn.addEventListener("click", () => {
      if (!started) {
        started = true;
        const end = Date.now() + 5000;
        const t = setInterval(() => {
          const left = Math.max(0, (end - Date.now()) / 1000);
          timerEl.textContent = "⏱ " + left.toFixed(1);
          if (left <= 0) { clearInterval(t); btn.disabled = true; btn.textContent = "DONE"; onDone(taps); }
        }, 50);
      }
      taps++; scoreEl.textContent = "Taps: " + taps;
      btn.style.transform = "scale(0.94)";
      setTimeout(() => (btn.style.transform = ""), 60);
    });
  },
};

// ---------- 3) Reaction: 5 rounds, faster = higher score ----------
const reaction = {
  key: "reaction",
  name: "Reaction Rush",
  blurb: "Wait for GREEN, then tap. 5 rounds — faster is better.",
  play(root, onDone) {
    clear(root);
    let round = 0, total = 0, waiting = false, startTime = 0, timeoutId = null;
    const ui = el(`
      <div class="game">
        <div class="game-top"><span class="game-score">Round 1 / 5</span><span class="game-total">Score: 0</span></div>
        <button class="react-pad wait">Wait…</button>
        <div class="game-hint">Tap the moment it turns green</div>
      </div>`);
    root.appendChild(ui);
    const roundEl = ui.querySelector(".game-score");
    const totalEl = ui.querySelector(".game-total");
    const pad = ui.querySelector(".react-pad");

    function armRound() {
      pad.className = "react-pad wait"; pad.textContent = "Wait…"; waiting = false;
      const delay = 900 + Math.random() * 2100;
      timeoutId = setTimeout(() => {
        pad.className = "react-pad go"; pad.textContent = "TAP!";
        waiting = true; startTime = Date.now();
      }, delay);
    }
    pad.addEventListener("click", () => {
      if (!waiting) {
        // tapped too early — small penalty, restart the same round
        clearTimeout(timeoutId);
        pad.className = "react-pad early"; pad.textContent = "Too early! Resetting…";
        setTimeout(armRound, 800);
        return;
      }
      const ms = Date.now() - startTime;
      total += Math.max(0, 600 - ms);      // faster tap → more points (higher is better)
      waiting = false; round++;
      totalEl.textContent = "Score: " + total;
      if (round >= 5) { pad.className = "react-pad done"; pad.textContent = "Done!"; onDone(total); }
      else { roundEl.textContent = `Round ${round + 1} / 5`; armRound(); }
    });
    armRound();
  },
};

// Order matters: the daily game rotates through this list.
const GAMES = [quickMath, tapFrenzy, reaction];

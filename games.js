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

// ---------- shared countdown helper ----------
// Calls onTick(secondsLeft) each second and onEnd() at zero.
// Returns a stop() you can call to cancel early.
function runTimer(seconds, onTick, onEnd) {
  let left = seconds;
  onTick(left);
  const id = setInterval(() => {
    left--; onTick(left);
    if (left <= 0) { clearInterval(id); onEnd(); }
  }, 1000);
  return () => clearInterval(id);
}

// Word list shared by the typing / scramble games
const WORDS = ["apple","garden","socrates","friend","summer","wonder","coffee",
  "laughter","planet","banana","library","ocean","guitar","thunder","pizza",
  "journey","rabbit","castle","window","dragon","seminar","dialogue","harbor"];

// ---------- 4) Sequence Memory (Simon) ----------
const seqMemory = {
  key: "seq-memory", name: "Sequence Memory",
  blurb: "Watch the pattern, then repeat it. It grows each round.",
  play(root, onDone) {
    clear(root);
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-score">Round 1</span><span class="game-hintline">Watch…</span></div>
      <div class="pad-grid">${[0,1,2,3].map(i => `<button class="pad pad-${i}" data-i="${i}"></button>`).join("")}</div></div>`);
    root.appendChild(ui);
    const scoreEl = ui.querySelector(".game-score");
    const hint = ui.querySelector(".game-hintline");
    const pads = [...ui.querySelectorAll(".pad")];
    let seq = [], pos = 0, accepting = false, round = 0;

    const flash = i => { pads[i].classList.add("lit"); setTimeout(() => pads[i].classList.remove("lit"), 320); };
    function playback() {
      accepting = false; hint.textContent = "Watch…";
      seq.forEach((i, k) => setTimeout(() => flash(i), 600 * (k + 1)));
      setTimeout(() => { accepting = true; pos = 0; hint.textContent = "Your turn"; }, 600 * (seq.length + 1));
    }
    function nextRound() {
      round++; scoreEl.textContent = "Round " + round;
      seq.push(Math.floor(Math.random() * 4)); playback();
    }
    pads.forEach(p => p.addEventListener("click", () => {
      if (!accepting) return;
      const i = +p.dataset.i; flash(i);
      if (i === seq[pos]) {
        pos++;
        if (pos === seq.length) { accepting = false; setTimeout(nextRound, 700); }
      } else { accepting = false; hint.textContent = "❌"; onDone(round - 1); }
    }));
    nextRound();
  },
};

// ---------- 5) Color Clash (Stroop) ----------
const STROOP = [["Red","#ee5253"],["Blue","#0abde3"],["Green","#10ac84"],["Orange","#ff9f43"]];
const stroop = {
  key: "stroop", name: "Color Clash",
  blurb: "Tap the COLOR the word is printed in — ignore what it says.",
  play(root, onDone) {
    clear(root);
    let score = 0, inkIndex = 0;
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-timer">⏱ 20</span><span class="game-score">Score: 0</span></div>
      <div class="stroop-word">RED</div>
      <div class="swatch-row">${STROOP.map((c,i) => `<button class="swatch" data-i="${i}" style="background:${c[1]}">${c[0]}</button>`).join("")}</div></div>`);
    root.appendChild(ui);
    const timerEl = ui.querySelector(".game-timer");
    const scoreEl = ui.querySelector(".game-score");
    const wordEl = ui.querySelector(".stroop-word");
    function next() {
      const w = Math.floor(Math.random() * 4); inkIndex = Math.floor(Math.random() * 4);
      wordEl.textContent = STROOP[w][0].toUpperCase(); wordEl.style.color = STROOP[inkIndex][1];
    }
    ui.querySelectorAll(".swatch").forEach(b => b.addEventListener("click", () => {
      if (+b.dataset.i === inkIndex) { score++; scoreEl.textContent = "Score: " + score; } next();
    }));
    next();
    runTimer(20, l => timerEl.textContent = "⏱ " + l, () => { ui.querySelectorAll(".swatch").forEach(b => b.disabled = true); onDone(score); });
  },
};

// ---------- 6) Odd One Out ----------
const ODD_PAIRS = [["🍏","🍎"],["🐶","🐱"],["⭐","🌟"],["😀","😳"],["🔵","🟣"],["🌹","🌷"],["🐟","🐠"],["🚗","🚕"],["🌙","🌚"]];
const oddOne = {
  key: "odd-one", name: "Odd One Out",
  blurb: "Spot the one that's different. Grids get bigger!",
  play(root, onDone) {
    clear(root);
    let score = 0;
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-timer">⏱ 25</span><span class="game-score">Found: 0</span></div>
      <div class="odd-grid"></div></div>`);
    root.appendChild(ui);
    const timerEl = ui.querySelector(".game-timer");
    const scoreEl = ui.querySelector(".game-score");
    const grid = ui.querySelector(".odd-grid");
    function round() {
      const n = Math.min(6, 3 + Math.floor(score / 4));
      grid.style.gridTemplateColumns = `repeat(${n},1fr)`;
      const pair = ODD_PAIRS[Math.floor(Math.random() * ODD_PAIRS.length)];
      const flip = Math.random() < 0.5;
      const base = pair[flip ? 0 : 1], odd = pair[flip ? 1 : 0];
      const total = n * n, oddAt = Math.floor(Math.random() * total);
      grid.innerHTML = "";
      for (let k = 0; k < total; k++) {
        const b = document.createElement("button");
        b.className = "odd-cell"; b.textContent = k === oddAt ? odd : base;
        b.addEventListener("click", () => { if (k === oddAt) { score++; scoreEl.textContent = "Found: " + score; round(); } });
        grid.appendChild(b);
      }
    }
    round();
    runTimer(25, l => timerEl.textContent = "⏱ " + l, () => { grid.style.pointerEvents = "none"; onDone(score); });
  },
};

// ---------- 7) Whack-a-Mole ----------
const whack = {
  key: "whack", name: "Whack-a-Mole",
  blurb: "Tap the moles before they vanish. 15 seconds!",
  play(root, onDone) {
    clear(root);
    let score = 0, current = -1;
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-timer">⏱ 15</span><span class="game-score">Hits: 0</span></div>
      <div class="mole-grid">${[...Array(9)].map((_, i) => `<button class="mole-cell" data-i="${i}"></button>`).join("")}</div></div>`);
    root.appendChild(ui);
    const timerEl = ui.querySelector(".game-timer");
    const scoreEl = ui.querySelector(".game-score");
    const cells = [...ui.querySelectorAll(".mole-cell")];
    cells.forEach(c => c.addEventListener("click", () => {
      if (+c.dataset.i === current) { score++; scoreEl.textContent = "Hits: " + score; c.textContent = ""; current = -1; }
    }));
    const mv = setInterval(() => {
      if (current >= 0) cells[current].textContent = "";
      current = Math.floor(Math.random() * 9); cells[current].textContent = "🐹";
    }, 700);
    runTimer(15, l => timerEl.textContent = "⏱ " + l, () => { clearInterval(mv); cells.forEach(c => { c.disabled = true; c.textContent = ""; }); onDone(score); });
  },
};

// ---------- 8) Aim Trainer ----------
const aim = {
  key: "aim", name: "Aim Trainer",
  blurb: "Tap the target as many times as you can in 15s.",
  play(root, onDone) {
    clear(root);
    let score = 0;
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-timer">⏱ 15</span><span class="game-score">Hits: 0</span></div>
      <div class="aim-area"><button class="aim-target">🎯</button></div></div>`);
    root.appendChild(ui);
    const timerEl = ui.querySelector(".game-timer");
    const scoreEl = ui.querySelector(".game-score");
    const area = ui.querySelector(".aim-area");
    const target = ui.querySelector(".aim-target");
    function move() {
      const maxX = Math.max(0, area.clientWidth - 52), maxY = Math.max(0, area.clientHeight - 52);
      target.style.left = Math.random() * maxX + "px"; target.style.top = Math.random() * maxY + "px";
    }
    target.addEventListener("click", () => { score++; scoreEl.textContent = "Hits: " + score; move(); });
    setTimeout(move, 60);
    runTimer(15, l => timerEl.textContent = "⏱ " + l, () => { target.disabled = true; onDone(score); });
  },
};

// ---------- 9) Rock Paper Scissors ----------
const rps = {
  key: "rps", name: "Rock Paper Scissors",
  blurb: "Best of 10 against the computer. Win as many as you can.",
  play(root, onDone) {
    clear(root);
    let round = 0, wins = 0;
    const moves = [["✊","Rock"],["✋","Paper"],["✌️","Scissors"]];
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-score">Round 1 / 10</span><span class="game-total">Wins: 0</span></div>
      <div class="rps-result">Pick your move</div>
      <div class="rps-row">${moves.map((m,i) => `<button class="rps-btn" data-i="${i}">${m[0]}</button>`).join("")}</div></div>`);
    root.appendChild(ui);
    const roundEl = ui.querySelector(".game-score");
    const winsEl = ui.querySelector(".game-total");
    const res = ui.querySelector(".rps-result");
    ui.querySelectorAll(".rps-btn").forEach(b => b.addEventListener("click", () => {
      const you = +b.dataset.i, cpu = Math.floor(Math.random() * 3);
      let outcome = you === cpu ? "Tie" : ((you - cpu + 3) % 3 === 1 ? "Win" : "Lose");
      if (outcome === "Win") wins++;
      winsEl.textContent = "Wins: " + wins;
      res.textContent = `You ${moves[you][0]} vs ${moves[cpu][0]} — ${outcome}!`;
      round++;
      if (round >= 10) { ui.querySelectorAll(".rps-btn").forEach(x => x.disabled = true); setTimeout(() => onDone(wins), 600); }
      else roundEl.textContent = `Round ${round + 1} / 10`;
    }));
  },
};

// ---------- 10) Guess the Number ----------
const guessNum = {
  key: "guess-num", name: "Guess the Number",
  blurb: "I'm thinking of 1–100. Find it in as few guesses as you can.",
  play(root, onDone) {
    clear(root);
    const secret = 1 + Math.floor(Math.random() * 100);
    let guesses = 0;
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-score">Guesses: 0</span><span class="game-hintline">1 – 100</span></div>
      <div class="guess-feedback">Make a guess…</div>
      <input class="game-input" inputmode="numeric" placeholder="1-100" />
      <button class="btn" style="margin-top:12px">Guess</button></div>`);
    root.appendChild(ui);
    const gEl = ui.querySelector(".game-score");
    const fb = ui.querySelector(".guess-feedback");
    const input = ui.querySelector(".game-input");
    const btn = ui.querySelector(".btn");
    input.focus();
    function submit() {
      const v = parseInt(input.value, 10);
      if (!v || v < 1 || v > 100) { fb.textContent = "Enter a number 1–100"; return; }
      guesses++; gEl.textContent = "Guesses: " + guesses;
      if (v === secret) {
        const score = Math.max(5, 100 - (guesses - 1) * 12);
        fb.textContent = `🎉 ${secret} in ${guesses}!`; btn.disabled = true; input.disabled = true;
        setTimeout(() => onDone(score), 800);
      } else { fb.textContent = v < secret ? "⬆️ Higher" : "⬇️ Lower"; input.value = ""; input.focus(); }
    }
    btn.addEventListener("click", submit);
    input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  },
};

// ---------- 11) Type Sprint ----------
const typeSprint = {
  key: "type-sprint", name: "Type Sprint",
  blurb: "Type each word correctly. As many as you can in 20s.",
  play(root, onDone) {
    clear(root);
    let score = 0, word = "";
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-timer">⏱ 20</span><span class="game-score">Words: 0</span></div>
      <div class="type-word">…</div>
      <input class="game-input" autocomplete="off" autocapitalize="off" placeholder="type it" /></div>`);
    root.appendChild(ui);
    const timerEl = ui.querySelector(".game-timer");
    const scoreEl = ui.querySelector(".game-score");
    const wEl = ui.querySelector(".type-word");
    const input = ui.querySelector(".game-input");
    function next() { word = WORDS[Math.floor(Math.random() * WORDS.length)]; wEl.textContent = word; input.value = ""; input.focus(); }
    input.addEventListener("input", () => { if (input.value.trim().toLowerCase() === word) { score++; scoreEl.textContent = "Words: " + score; next(); } });
    next();
    runTimer(20, l => timerEl.textContent = "⏱ " + l, () => { input.disabled = true; onDone(score); });
  },
};

// ---------- 12) True or False (math) ----------
const mathTF = {
  key: "math-tf", name: "True or False?",
  blurb: "Is the equation right? Tap fast. 20 seconds.",
  play(root, onDone) {
    clear(root);
    let score = 0, truth = false;
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-timer">⏱ 20</span><span class="game-score">Score: 0</span></div>
      <div class="game-prompt tf-eq">…</div>
      <div class="tf-row"><button class="btn tf-true">✅ True</button><button class="btn tf-false" style="background:linear-gradient(135deg,#ee5253,#ff9f43)">❌ False</button></div></div>`);
    root.appendChild(ui);
    const timerEl = ui.querySelector(".game-timer");
    const scoreEl = ui.querySelector(".game-score");
    const eq = ui.querySelector(".tf-eq");
    function next() {
      const a = 2 + Math.floor(Math.random() * 11), b = 2 + Math.floor(Math.random() * 11);
      const ops = [["+", a + b], ["−", a - b], ["×", a * b]];
      const [op, real] = ops[Math.floor(Math.random() * 3)];
      truth = Math.random() < 0.5;
      const shown = truth ? real : real + (Math.random() < 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 3));
      eq.textContent = `${a} ${op} ${b} = ${shown}`;
    }
    function answer(guess) { if (guess === truth) { score++; scoreEl.textContent = "Score: " + score; } next(); }
    ui.querySelector(".tf-true").addEventListener("click", () => answer(true));
    ui.querySelector(".tf-false").addEventListener("click", () => answer(false));
    next();
    runTimer(20, l => timerEl.textContent = "⏱ " + l, () => { ui.querySelectorAll("button").forEach(b => b.disabled = true); onDone(score); });
  },
};

// ---------- 13) Bigger Number ----------
const bigger = {
  key: "bigger", name: "Bigger Number",
  blurb: "Tap the larger number. Quick! 20 seconds.",
  play(root, onDone) {
    clear(root);
    let score = 0, left = 0, right = 0;
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-timer">⏱ 20</span><span class="game-score">Score: 0</span></div>
      <div class="two-row"><button class="big-btn big-left">0</button><button class="big-btn big-right">0</button></div></div>`);
    root.appendChild(ui);
    const timerEl = ui.querySelector(".game-timer");
    const scoreEl = ui.querySelector(".game-score");
    const lb = ui.querySelector(".big-left"), rb = ui.querySelector(".big-right");
    function next() {
      const base = 10 + Math.floor(Math.random() * 900);
      left = base; right = base + (Math.random() < 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 40));
      if (left === right) right++;
      lb.textContent = left; rb.textContent = right;
    }
    function pick(side) {
      const ok = (side === "l" && left > right) || (side === "r" && right > left);
      if (ok) { score++; scoreEl.textContent = "Score: " + score; } next();
    }
    lb.addEventListener("click", () => pick("l")); rb.addEventListener("click", () => pick("r"));
    next();
    runTimer(20, l => timerEl.textContent = "⏱ " + l, () => { lb.disabled = rb.disabled = true; onDone(score); });
  },
};

// ---------- 14) Digit Memory ----------
const digitMem = {
  key: "digit-mem", name: "Digit Memory",
  blurb: "Memorize the number, then type it. It grows each round.",
  play(root, onDone) {
    clear(root);
    let len = 3, done = 0, current = "";
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-score">Length: 3</span></div>
      <div class="digit-show">Get ready…</div>
      <input class="game-input" inputmode="numeric" style="display:none" placeholder="type the number" /></div>`);
    root.appendChild(ui);
    const scoreEl = ui.querySelector(".game-score");
    const show = ui.querySelector(".digit-show");
    const input = ui.querySelector(".game-input");
    function round() {
      scoreEl.textContent = "Length: " + len;
      current = ""; for (let i = 0; i < len; i++) current += Math.floor(Math.random() * 10);
      input.style.display = "none"; input.value = ""; show.textContent = current;
      setTimeout(() => { show.textContent = "Type it!"; input.style.display = "block"; input.focus(); }, 900 + len * 350);
    }
    input.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      if (input.value.trim() === current) { done = len; len++; round(); }
      else { input.disabled = true; onDone(done); }
    });
    round();
  },
};

// ---------- 15) Higher or Lower ----------
const hiLo = {
  key: "hi-lo", name: "Higher or Lower",
  blurb: "Will the next card be higher or lower? Build a streak.",
  play(root, onDone) {
    clear(root);
    const draw = () => 1 + Math.floor(Math.random() * 13);
    const label = n => n === 1 ? "A" : n === 11 ? "J" : n === 12 ? "Q" : n === 13 ? "K" : String(n);
    let streak = 0, card = draw();
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-score">Streak: 0</span></div>
      <div class="card-face">${label(card)}</div>
      <div class="two-row"><button class="btn hi">⬆️ Higher</button><button class="btn lo" style="background:linear-gradient(135deg,#0abde3,#6d5efc)">⬇️ Lower</button></div>
      <div class="game-hint hilo-msg"></div></div>`);
    root.appendChild(ui);
    const faceEl = ui.querySelector(".card-face");
    const scoreEl = ui.querySelector(".game-score");
    const msg = ui.querySelector(".hilo-msg");
    function guess(dir) {
      const next = draw();
      const ok = dir === "hi" ? next >= card : next <= card;
      msg.textContent = `Next was ${label(next)}`;
      if (ok) { streak++; scoreEl.textContent = "Streak: " + streak; card = next; faceEl.textContent = label(card); }
      else { faceEl.textContent = label(next); ui.querySelectorAll(".btn").forEach(b => b.disabled = true); setTimeout(() => onDone(streak), 800); }
    }
    ui.querySelector(".hi").addEventListener("click", () => guess("hi"));
    ui.querySelector(".lo").addEventListener("click", () => guess("lo"));
  },
};

// ---------- 16) Number Hunt (Schulte table) ----------
const schulte = {
  key: "schulte", name: "Number Hunt",
  blurb: "Tap 1→25 in order as fast as you can. 30 seconds.",
  play(root, onDone) {
    clear(root);
    let target = 1;
    const nums = [...Array(25)].map((_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [nums[i], nums[j]] = [nums[j], nums[i]]; }
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-timer">⏱ 30</span><span class="game-score">Find: 1</span></div>
      <div class="schulte-grid">${nums.map(n => `<button class="schulte-cell" data-n="${n}">${n}</button>`).join("")}</div></div>`);
    root.appendChild(ui);
    const timerEl = ui.querySelector(".game-timer");
    const scoreEl = ui.querySelector(".game-score");
    let stop;
    ui.querySelectorAll(".schulte-cell").forEach(c => c.addEventListener("click", () => {
      if (+c.dataset.n !== target) return;
      c.classList.add("hit"); c.disabled = true; target++;
      if (target > 25) { if (stop) stop(); onDone(25); return; }
      scoreEl.textContent = "Find: " + target;
    }));
    stop = runTimer(30, l => timerEl.textContent = "⏱ " + l, () => { ui.querySelectorAll(".schulte-cell").forEach(c => c.disabled = true); onDone(target - 1); });
  },
};

// ---------- 17) Word Scramble ----------
const unscramble = {
  key: "unscramble", name: "Word Scramble",
  blurb: "Unscramble the word and type it. 30 seconds.",
  play(root, onDone) {
    clear(root);
    let score = 0, answer = "";
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-timer">⏱ 30</span><span class="game-score">Solved: 0</span></div>
      <div class="scramble-word">…</div>
      <input class="game-input" autocomplete="off" autocapitalize="off" placeholder="the word" />
      <div class="game-hint">Press Enter</div></div>`);
    root.appendChild(ui);
    const timerEl = ui.querySelector(".game-timer");
    const scoreEl = ui.querySelector(".game-score");
    const wEl = ui.querySelector(".scramble-word");
    const input = ui.querySelector(".game-input");
    const shuffle = w => { const a = w.split(""); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.join(""); };
    function next() { answer = WORDS[Math.floor(Math.random() * WORDS.length)]; let s = shuffle(answer); while (s === answer) s = shuffle(answer); wEl.textContent = s.toUpperCase(); input.value = ""; input.focus(); }
    input.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      if (input.value.trim().toLowerCase() === answer) { score++; scoreEl.textContent = "Solved: " + score; next(); }
      else input.value = "";
    });
    next();
    runTimer(30, l => timerEl.textContent = "⏱ " + l, () => { input.disabled = true; onDone(score); });
  },
};

// ---------- 18) Stop the Bar ----------
const stopBar = {
  key: "stop-bar", name: "Stop the Bar",
  blurb: "Stop the slider in the green zone. 5 rounds.",
  play(root, onDone) {
    clear(root);
    let round = 0, total = 0, raf = null, pos = 0, dir = 1, running = false;
    const ui = el(`<div class="game">
      <div class="game-top"><span class="game-score">Round 1 / 5</span><span class="game-total">Score: 0</span></div>
      <div class="bar-track"><div class="bar-zone"></div><div class="bar-marker"></div></div>
      <button class="btn bar-stop">STOP</button></div>`);
    root.appendChild(ui);
    const roundEl = ui.querySelector(".game-score");
    const totalEl = ui.querySelector(".game-total");
    const marker = ui.querySelector(".bar-marker");
    const stopBtn = ui.querySelector(".bar-stop");
    function animate() {
      pos += dir * 1.4;
      if (pos >= 100) { pos = 100; dir = -1; } if (pos <= 0) { pos = 0; dir = 1; }
      marker.style.left = pos + "%"; raf = requestAnimationFrame(animate);
    }
    function start() { running = true; pos = 0; dir = 1; animate(); }
    stopBtn.addEventListener("click", () => {
      if (!running) return;
      running = false; cancelAnimationFrame(raf);
      const pts = Math.max(0, Math.round(100 - Math.abs(pos - 50) * 2));
      total += pts; totalEl.textContent = "Score: " + total; round++;
      if (round >= 5) { stopBtn.disabled = true; setTimeout(() => onDone(total), 500); }
      else { roundEl.textContent = `Round ${round + 1} / 5`; setTimeout(start, 400); }
    });
    start();
  },
};

// Order matters: the daily game rotates through this list.
const GAMES = [
  quickMath, tapFrenzy, reaction,
  seqMemory, stroop, oddOne, whack, aim, rps, guessNum,
  typeSprint, mathTF, bigger, digitMem, hiLo, schulte, unscramble, stopBar,
];

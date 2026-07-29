// ============================================================
//  Common Place — app logic
//  Flow: pick your name → answer today's question → that
//  unlocks everyone's answers → play today's game → leaderboard.
// ============================================================

const app = document.getElementById("app");

// ---- tiny state ----
let db = null;                          // Supabase client
let name = localStorage.getItem("cp_name") || null;
let tab = "today";                      // "today" | "board"

// ---- date + daily pickers (same for everyone, changes each day) ----
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function dayIndex() { return Math.floor(Date.now() / 86400000); }
function questionOfTheDay() { return QUESTIONS[dayIndex() % QUESTIONS.length]; }
function gameOfTheDay() { return GAMES[dayIndex() % GAMES.length]; }

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ============================================================
//  Boot
// ============================================================
function boot() {
  if (!CONFIG.SUPABASE_URL || CONFIG.SUPABASE_URL.includes("PASTE_YOUR")) {
    app.innerHTML = `<div class="card"><h2>Almost there 👋</h2>
      <p class="center-note">Open <b>config.js</b> and paste your Supabase URL and key,
      then refresh. The README has step-by-step instructions.</p></div>`;
    return;
  }
  db = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  name ? renderApp() : renderNamePicker();
}

// ============================================================
//  Name picker
// ============================================================
function renderNamePicker() {
  app.innerHTML = `
    <div class="picker-title">📖 Common Place</div>
    <div class="picker-sub">One question a day. Answer to see everyone's.</div>
    <div class="name-grid">
      ${CONFIG.FRIENDS.map(f => `<button class="name-btn" data-n="${escapeHtml(f)}">${escapeHtml(f)}</button>`).join("")}
    </div>`;
  app.querySelectorAll(".name-btn").forEach(b =>
    b.addEventListener("click", () => {
      name = b.dataset.n;
      localStorage.setItem("cp_name", name);
      renderApp();
    })
  );
}

// ============================================================
//  App shell (header + content + bottom tabs)
// ============================================================
function renderApp() {
  app.innerHTML = `
    <div class="header">
      <div class="logo">📖 Common Place</div>
      <button class="whoami" id="whoami">${escapeHtml(name)} ⌄</button>
    </div>
    <div id="content"><div class="center-note">Loading…</div></div>
    <div class="tabs">
      <button class="tab ${tab === "today" ? "active" : ""}" data-t="today"><span class="ic">💬</span>Today</button>
      <button class="tab ${tab === "board" ? "active" : ""}" data-t="board"><span class="ic">🏆</span>Leaderboard</button>
    </div>`;

  app.querySelector("#whoami").addEventListener("click", () => {
    if (confirm("Switch to a different name?")) { localStorage.removeItem("cp_name"); name = null; renderNamePicker(); }
  });
  app.querySelectorAll(".tab").forEach(t =>
    t.addEventListener("click", () => { tab = t.dataset.t; renderApp(); })
  );

  tab === "today" ? renderToday() : renderBoard();
}

// ============================================================
//  TODAY: question → answer → reveal → play
// ============================================================
async function renderToday() {
  const content = app.querySelector("#content");
  const q = questionOfTheDay();
  const today = todayStr();

  const { data: answers, error } = await db
    .from("answers").select("player, answer").eq("question_date", today);

  if (error) { content.innerHTML = errorCard(error); return; }

  const mine = answers.find(a => a.player === name);

  let html = `<div class="card">
    <div class="eyebrow">Today's question</div>
    <span class="pill ${q.tag}">${q.tag}</span>
    <p class="question">${escapeHtml(q.q)}</p>`;

  if (!mine) {
    // not answered yet → show the form, keep others hidden
    const others = answers.length;
    html += `
      <textarea id="answer" placeholder="Your take…"></textarea>
      <button class="btn" id="submit">Answer &amp; reveal everyone's</button>
      <div class="waiting-note">${others ? `${others} friend${others > 1 ? "s have" : " has"} answered — add yours to reveal them 👀` : "Be the first to answer today."}</div>
    </div>`;
    content.innerHTML = html;
    content.querySelector("#submit").addEventListener("click", submitAnswer);
  } else {
    // answered → reveal everyone + offer the game
    html += `<div class="answers">
      ${answers.map(a => `
        <div class="answer-row">
          <div class="answer-name">${escapeHtml(a.player)}${a.player === name ? " (you)" : ""}</div>
          <div class="answer-text">${escapeHtml(a.answer)}</div>
        </div>`).join("")}
    </div></div>
    <div class="card">
      <div class="eyebrow">Today's game</div>
      <p class="question">${escapeHtml(gameOfTheDay().name)}</p>
      <p class="center-note" style="margin:0 0 4px">${escapeHtml(gameOfTheDay().blurb)}</p>
      <button class="btn" id="play">Play & score 🎮</button>
    </div>`;
    content.innerHTML = html;
    content.querySelector("#play").addEventListener("click", playToday);
  }
}

async function submitAnswer() {
  const text = app.querySelector("#answer").value.trim();
  if (!text) { app.querySelector("#answer").focus(); return; }
  const btn = app.querySelector("#submit");
  btn.disabled = true; btn.textContent = "Saving…";
  const { error } = await db.from("answers")
    .upsert({ question_date: todayStr(), player: name, answer: text }, { onConflict: "question_date,player" });
  if (error) { alert("Couldn't save: " + error.message); btn.disabled = false; btn.textContent = "Answer & reveal everyone's"; return; }
  renderToday();
}

// ============================================================
//  Game overlay
// ============================================================
function playToday() {
  const game = gameOfTheDay();
  const content = app.querySelector("#content");
  content.innerHTML = `<div class="card">
      <div class="eyebrow">Today's game · ${escapeHtml(game.name)}</div>
      <div id="game-root"></div>
    </div>`;
  game.play(content.querySelector("#game-root"), async (score) => {
    const root = content.querySelector("#game-root");
    root.innerHTML = `<div class="game">
        <p class="question">Nice — you scored ${score}! 🎉</p>
        <button class="btn" id="save-score">Save to leaderboard</button>
        <button class="btn ghost" id="again">Play again</button>
      </div>`;
    root.querySelector("#again").addEventListener("click", playToday);
    root.querySelector("#save-score").addEventListener("click", async (e) => {
      e.target.disabled = true; e.target.textContent = "Saving…";
      const { error } = await db.from("scores")
        .insert({ game_date: todayStr(), game: game.key, player: name, score });
      if (error) { alert("Couldn't save: " + error.message); return; }
      tab = "board"; renderApp();
    });
  });
}

// ============================================================
//  LEADERBOARD (today's game, best score per person)
// ============================================================
async function renderBoard() {
  const content = app.querySelector("#content");
  const game = gameOfTheDay();
  const { data: rows, error } = await db
    .from("scores").select("player, score").eq("game_date", todayStr()).eq("game", game.key);
  if (error) { content.innerHTML = errorCard(error); return; }

  // best score per player
  const best = {};
  rows.forEach(r => { if (best[r.player] === undefined || r.score > best[r.player]) best[r.player] = r.score; });
  const ranked = Object.entries(best).map(([player, score]) => ({ player, score })).sort((a, b) => b.score - a.score);

  let html = `<div class="card">
    <div class="eyebrow">Today's leaderboard</div>
    <p class="question" style="font-size:20px">🎮 ${escapeHtml(game.name)}</p>`;

  if (ranked.length === 0) {
    html += `<p class="center-note">No scores yet today. Answer the question, then play!</p>`;
  } else {
    html += ranked.map((r, i) => `
      <div class="lb-row ${r.player === name ? "lb-mine" : ""}">
        <div class="lb-rank ${i === 0 ? "top" : ""}">${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</div>
        <div class="lb-name">${escapeHtml(r.player)}${r.player === name ? " (you)" : ""}</div>
        <div class="lb-score">${r.score}</div>
      </div>`).join("");
  }
  html += `</div><p class="center-note">A new question &amp; game unlock every day 🌅</p>`;
  content.innerHTML = html;
}

function errorCard(error) {
  return `<div class="card"><h3>Hmm, couldn't reach the database.</h3>
    <p class="center-note">${escapeHtml(error.message || "Unknown error")}</p>
    <p class="center-note">Double-check your keys in config.js and that you ran schema.sql in Supabase.</p></div>`;
}

boot();

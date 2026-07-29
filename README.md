# 📖 Common Place

One thoughtful (or ridiculous) question a day. Everyone answers, then everyone's
answers unlock at once — then you play a quick game and fight for the leaderboard.
Built for 6 friends scattered across the map after the TAC Great Books summer.

No installing, no build tools. It's just files + a free database.

---

## How it works (the flow)
1. You pick your name.
2. You see today's question and answer it.
3. Answering **reveals everyone's answers** (no peeking early 👀).
4. You play **today's mini-game** and save your score.
5. The **leaderboard** ranks everyone on that game.
6. Tomorrow: brand-new question + game. Same for all 6 of you.

---

## 🛠 Set it up (about 15–20 minutes, all free)

You only touch **one** file of code (`config.js`). Follow in order.

### Step 1 — Make the database (Supabase)
1. Go to **[supabase.com](https://supabase.com)** → **Start your project** → sign in with GitHub.
2. Click **New project**. Give it a name (e.g. `commonplace`), set a database password
   (save it somewhere), pick the closest region, click **Create**. Wait ~1 min.
3. In the left sidebar open **SQL Editor** → **New query**.
4. Open the file **`schema.sql`** from this project, copy *everything*, paste it in, click **Run**.
   You should see "Success". (This creates the tables that store answers + scores.)

### Step 2 — Get your two keys
1. Left sidebar → **Project Settings** (gear) → **API**.
2. Copy the **Project URL** and the **anon public** key.
   - The `anon` key is meant to live in front-end code — it's **not** a password, so it's fine to use here.

### Step 3 — Fill in `config.js`
Open **`config.js`** and:
- Paste your **Project URL** into `SUPABASE_URL`.
- Paste the **anon public** key into `SUPABASE_ANON_KEY`.
- Replace the placeholder names in `FRIENDS` with your 6 real names.

### Step 4 — Try it on your computer
Just **double-click `index.html`** to open it in your browser. Pick a name, answer,
play the game. If everything saved, you're ready to put it online.
> If you see "Almost there," your keys in `config.js` aren't filled in yet.

### Step 5 — Put it on GitHub
If you made this repo on GitHub already, from this folder in a terminal:
```bash
git init
git add .
git commit -m "Common Place: first version"
git branch -M main
git remote add origin <YOUR-GITHUB-REPO-URL>
git push -u origin main
```

### Step 6 — Deploy it (Vercel) so friends can use it
1. Go to **[vercel.com](https://vercel.com)** → sign in with GitHub.
2. **Add New… → Project** → import this repo.
3. Framework preset: **Other**. Leave everything else default. Click **Deploy**.
4. In ~30 seconds you get a public link like `common-place.vercel.app`.

### Step 7 — Share the link 🎉
Text the link to your 6 friends. On a phone they can tap **Share → Add to Home Screen**
so it feels like a real app. Every day, open it and answer.

---

## 🎨 Make it yours
- **Add questions:** open `questions.js` and add lines like
  `{ q: "your question?", tag: "funny" },`
- **Add / change games:** `games.js` — copy an existing game object and tweak it.
  Rule: call `onDone(score)` when it ends, and **higher score = better**.
- **Change colors/vibe:** edit the `:root` colors at the top of `style.css`.
- **Change the name shown:** it's `Common Place` in `index.html` and `app.js`.

---

## 📁 What each file does
| File | What it's for |
|------|----------------|
| `index.html` | The page skeleton; loads everything else |
| `config.js` | **The only file you edit** — your keys + friends |
| `questions.js` | The daily question bank |
| `games.js` | The mini-games |
| `app.js` | The app logic (screens, saving, leaderboard) |
| `style.css` | How it looks |
| `schema.sql` | Run once in Supabase to create the database |

---

## Ideas for later (v2)
- Streaks 🔥 for answering every day
- Reactions/comments on friends' answers
- All-time leaderboard across every game
- A "question archive" to reread old days
- Real accounts so strangers could join safely

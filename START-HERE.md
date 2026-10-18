# Start here: from an empty folder to a live app

Do these in order. **You** do the parts that need your accounts; **Claude in your terminal** does the code. Details for each part are in `IMPLEMENTATION.md`.

---

## Step 0. Check your tools (once)

| Tool | Check | Get it |
|---|---|---|
| Node.js (LTS, 22+) | `node -v` | nodejs.org |
| Git | `git --version` | git-scm.com |
| VS Code | | code.visualstudio.com |
| Claude in the terminal (Claude Code) | `claude --version` | you already have it |
| GitHub CLI (optional, lets Claude create and push the repo) | `gh --version`, then `gh auth login` | cli.github.com |

Accounts: **GitHub**, **Google** (for Firebase), **Vercel** (sign up with GitHub).

---

## Step 1. Put these files in your folder

Unzip this package into your project folder so it looks like this:

```
your-folder/
├── CLAUDE.md            # rules Claude reads automatically
├── IMPLEMENTATION.md    # the full plan
├── START-HERE.md        # this file
└── design/              # your prototype: screens, icons, tokens
```

If your folder already has other files in it, move them somewhere else first: the project should start from just these.

---

## Step 2. Set up Firebase (you, ~5 min)

1. Go to **console.firebase.google.com** → **Create a project** → name it `tracker-app` → Google Analytics **off** → Create.
2. On the project home, click the **Web** icon (`</>`) → app nickname `tracker-app` → **don't** tick Firebase Hosting → Register app.
3. You'll see a `firebaseConfig` with six values. Keep this tab open for step 3.
4. Left menu → **Build → Authentication** → **Get started** → **Sign-in method** tab → **Anonymous** → Enable → Save.
5. Left menu → **Build → Firestore Database** → **Create database** → location **europe-west6 (Zürich)** → **Start in production mode** → Create. (The location can't be changed later.)

---

## Step 3. Add your Firebase keys (you, ~2 min)

In your folder, create a file called `.env.local` and paste the six values from step 2.3:

```bash
VITE_FIREBASE_API_KEY=paste-apiKey-here
VITE_FIREBASE_AUTH_DOMAIN=paste-authDomain-here
VITE_FIREBASE_PROJECT_ID=paste-projectId-here
VITE_FIREBASE_STORAGE_BUCKET=paste-storageBucket-here
VITE_FIREBASE_MESSAGING_SENDER_ID=paste-messagingSenderId-here
VITE_FIREBASE_APP_ID=paste-appId-here
```

No quotes, no spaces around `=`. This file is never committed to GitHub.

---

## Step 4. Create the GitHub repo (you, ~1 min)

Skip this if you installed the GitHub CLI and are logged in (`gh auth status`); Claude can create the repo for you in step 5.

1. github.com → **New repository** → name `tracker-app` → Private or Public, your choice.
2. **Don't** add a README, .gitignore or licence. It must be empty.
3. Copy the repo URL, e.g. `https://github.com/MariykaUA/tracker-app.git`.

---

## Step 5. Let Claude set up the project (Claude, ~10 min)

Open a terminal **in your folder** (in VS Code: Terminal → New Terminal), run `claude`, and paste this prompt:

```text
Set up this project exactly as IMPLEMENTATION.md section 3 describes, following CLAUDE.md.

1. Scaffold with create-vue (TypeScript, Vue Router, Pinia, Vitest, ESLint, Prettier; no JSX, no end-to-end tests). This folder already contains CLAUDE.md, IMPLEMENTATION.md, START-HERE.md, design/ and .env.local, so scaffold into a temporary subfolder and move its contents here without overwriting or deleting any of those. Check `npm create vue@latest -- --help` for the non-interactive flags.
2. Install firebase, sass-embedded and eslint-plugin-vuejs-accessibility.
3. Clean out the create-vue demo content (section 3.2).
4. Make sure .gitignore ignores .env.local, then create .env.example with the same keys and empty values.
5. git init, make the first commit on main ("chore: scaffold Vue project with create-vue"), add the GitHub remote https://github.com/MariykaUA/tracker-app.git and push. If the repo doesn't exist yet and gh is logged in, create it with gh first.
6. Don't run tests. Tell me when it's done and what you did.
```

Change the repo URL if yours is different.

Then open the folder in VS Code and run `npm run dev` to see the empty app.

---

## Step 6. Build the app, one task at a time (Claude)

Each item in the **build order checklist** (IMPLEMENTATION.md section 15) is one task. For each, start a fresh request in Claude in the terminal:

```text
Do step 2 of the build order checklist in IMPLEMENTATION.md, following CLAUDE.md:
new branch from main, build it to match the prototype in design/, good small commits,
lint and type-check, then push the branch and tell me it's ready for a pull request.
```

Change the step number each time (2, then 3, then 4…). After each one:

1. Check it in the browser (`npm run dev`) against the matching artboard in the prototype.
2. On GitHub, open the **pull request** for that branch, look through it, **merge** it, delete the branch.
3. Back in VS Code: `git switch main && git pull`.

---

## Step 7. Publish the security rules (you, once, after checklist step 3)

Once `firestore.rules` exists in the repo:

1. Firebase console → **Firestore Database** → **Rules** tab.
2. Replace everything with the contents of `firestore.rules` → **Publish**.

Without this, the app can't read or write data (production mode blocks everything).

---

## Step 8. Deploy on Vercel (you, ~5 min, after checklist step 12)

1. **vercel.com** → sign in with GitHub → **Add New → Project** → import `tracker-app`.
2. Framework preset: **Vite** (detected). Build command `npm run build`, output `dist`.
3. **Environment Variables**: add the six `VITE_FIREBASE_*` values from `.env.local`, for Production and Preview.
4. **Deploy**. Open the URL on your phone and add it to your home screen.

From now on: every pull request gets a preview link, and every merge into `main` goes live automatically.

---

## Everyday workflow (after setup)

```text
New task → Claude: "Do <task>, following CLAUDE.md"
         → Claude makes a branch, commits, pushes
         → you: check the Vercel preview, merge the pull request
         → you: git switch main && git pull
```

# Editing AuraCook in VS Code — from zero

**macOS edition.** Everything below is copy‑paste into Terminal. Mac shortcuts use `Cmd` where other guides say `Ctrl` — see §3.

---

## 0. Install these three things first

| Tool | Why | Check it works |
|---|---|---|
| **Node.js LTS** (18 or 20) | runs the dev server and the build | `node -v` → `v20.x` |
| **Git** | pulls the code, saves your history | `git -v` → `git version 2.x` |
| **VS Code** | the editor | opens |

Then in VS Code install two extensions (`Ctrl+Shift+X` → search):

- **ESLint** — underlines mistakes as you type
- **Prettier** — formats on save (optional but nice)

And in **Chrome/Edge**, install the **Redux DevTools** extension — you'll use it to show the examiner the action log.

### macOS quick install (copy-paste)

Open **Terminal** (`Cmd+Space`, type "Terminal") and check what you already have:

```bash
node -v      # need v18 or v20
git -v       # macOS usually has this already
```

- **No Node?** Easiest: the `.pkg` installer from <https://nodejs.org> (choose **LTS**, macOS Installer).
  With Homebrew instead: `brew install node`. Avoid `sudo npm install` — ever.
- **No Git?** `xcode-select --install` → click Install. (Or `brew install git`.)
- **`code .` says "command not found"?** In VS Code press `Cmd+Shift+P`, type **"Shell Command: Install 'code'
  command in PATH"**, hit Enter, then close and reopen Terminal. Done once, forever.

You do **not** need Xcode itself, and you do **not** need sudo for anything in this project.

---

## 1. Get the code onto your laptop

The Redux version lives on the branch **`arena/f920ace0-aura-cook`** (not `main`). In a terminal:

```bash
git clone https://github.com/Gurrahmat/aura-cook.git
cd aura-cook
git switch arena/f920ace0-aura-cook
```

Already cloned it earlier? Then instead:

```bash
cd aura-cook
git fetch origin
git switch arena/f920ace0-aura-cook
git pull
```

Sanity check — you should see the store folder:

```bash
ls src/store
# hooks.js  pantrySlice.js  selectors.js  store.js  timerSlice.js  uiSlice.js
```

If `src/context` still exists instead, you are on `main` — run the `git switch` line again.

Now open it in VS Code:

```bash
code .
```

(or **File → Open Folder → aura-cook**). You should see `src/`, `package.json`, `index.html` in the sidebar.

---

## 2. Run it

In VS Code open the terminal: **`` Ctrl+` ``** (backtick), then:

```bash
npm install     # first time only — downloads React, Vite, Redux Toolkit etc.
npm run dev     # starts the dev server
```

You'll see:

```
VITE v5.4.21  ready in 195 ms
➜  Local:   http://localhost:3000/
```

**Ctrl+click that link** (or open it in your browser). The app appears. Leave the terminal running — it's the server.

**This is the loop you'll repeat hundreds of times:**

> edit a file → **`Ctrl+S`** → the browser updates by itself (Vite HMR, usually under a second)

If it doesn't update, look at the terminal — a red error there is your actual problem.

---

## 3. The shortcuts that matter (macOS keys)

On a Mac it's **`Cmd`** where the guide says `Ctrl`, and **`Cmd+S`** to save. Full mapping:

| Guide says | On your Mac |
|---|---|
| `Ctrl+S` (save) | **`Cmd+S`** |
| `Ctrl+P` (jump to file) | **`Cmd+P`** |
| `Ctrl+Shift+F` (search project) | **`Cmd+Shift+F`** |
| `Ctrl+``` (terminal) | **`Ctrl+`** — this one really is Control, because Cmd+` cycles windows |
| `Ctrl+Shift+G` (source control) | **`Ctrl+Shift+G`** |
| `Ctrl+Z` (undo) | **`Cmd+Z`** |
| `Ctrl+Shift+R` (hard refresh in browser) | **`Cmd+Shift+R`** |
| `F12` (go to definition) | **`F12`** or `Cmd+click` on the symbol |
| `Alt+←` (go back) | **`Ctrl+-`** or the back arrow in the toolbar |

### And the ones that matter generally



| Shortcut | Does | Use it for |
|---|---|---|
| `Ctrl+P` | jump to any file by name | "open `pantrySlice`" |
| `Ctrl+Shift+F` | search the whole project | find where `computeRecipeMatch` is used |
| `Ctrl+`` ` `` | show/hide terminal | run `git`, `npm` |
| `F12` | go to definition | click `itemAdded` in a page → land in the slice |
| `Alt+←` | go back | return after F12 |
| `Ctrl+Shift+G` | Source Control panel | commit without typing git commands |

`Alt+F12` = peek the definition inline. `Ctrl+Shift+P` = command palette ("Format Document", "Git: Commit", anything).

---

## 4. "I want to change X" — where to go

| I want to… | Edit this file | Look for |
|---|---|---|
| Change recipe text, times, ingredients, steps | `src/data/recipes.js` | the recipe's `title`, `ingredients: [...]`, `instructions: [...]` |
| Add a recipe | `src/data/recipes.js` | copy one whole `{ id: ..., ... }` block, change the `id` |
| Change which items you start with | `src/data/defaultPantry.js` | `DEFAULT_PANTRY` |
| Change the ingredient dropdown list | `src/pages/PantryPage.jsx` | `COMMON_INGREDIENTS` (top of file) |
| Change colours / fonts / spacing | `src/styles/style.css` | `:root { --c-terracotta: ...; --font-serif: ... }` |
| Change "Can Make Now" threshold (70%) | `src/pages/RecipesPage.jsx` | `percent >= 70` |
| Change how matching works | `src/utils/match.js` | `computeRecipeMatch` — pure function, safe to experiment |
| Change the preset timer buttons (8m / 12m / 20m) | `src/components/MultiTimerDrawer.jsx` | `durationSeconds: 8 * 60` |
| Change a toast message | `src/store/store.js` | the `startListening` blocks |
| Add a page | `src/pages/`, `src/store/uiSlice.js`, `src/App.jsx` | new component → new file; `pageChanged` values; add a `{currentPage === 'x' && <XPage />}` line |
| Change the pantry rules (quantity 0 ⇒ Out of Stock) | `src/store/pantrySlice.js` | `normalize()` |

**Golden rule:** text and numbers usually live in `src/data/`; rules live in `src/store/` or `src/utils/`; looks live in
`src/styles/`; pages only glue things together.

---

## 5. Make your first safe edit (2 minutes)

Let's prove the loop works.

1. `Ctrl+P` → type `recipes.js` → Enter
2. Find the first recipe's title: `"Creamy Tuscan Garlic Chicken"`
3. Change it to `"Creamy Tuscan Garlic Chicken (my version)"`
4. `Ctrl+S`
5. Look at the browser — the card title changes instantly, no reload
6. Filenames with a dot (Vite HMR status) in the terminal confirm the update

Undo: `Ctrl+Z` then `Ctrl+S`.

**If you break something:** `Ctrl+Z` repeatedly, or in the terminal:

```bash
git restore src/pages/PantryPage.jsx     # throw away changes to one file
git status                               # see what you changed
git diff                                 # see the exact lines
```

---

## 6. Saving your work to GitHub (the examiner looks at this)

### Option A — the buttons

1. `Ctrl+Shift+G` (Source Control)
2. You'll see the changed files under **Changes**
3. Type a message in the box — e.g. `update pantry copy` — **never** "update", "changes", "final"
4. Click **✓ Commit**
5. Click **Sync Changes** (or the ⟳ icon) to push

### Option B — the terminal (recommended, you learn more)

```bash
git status                      # what changed
git diff                        # what changed inside the files
git add src/pages/PantryPage.jsx
git commit -m "restrict pantry ingredient name to dropdown list"
git push
```

**Feature branch habit** (worth marks — it shows process):

```bash
git switch -c feat/pantry-validation
# ...edit, commit a few times...
git push -u origin feat/pantry-validation
```

Then open a pull request on GitHub and let your teammate review it.

### What NOT to commit

Already ignored for you: `node_modules/`, `dist/`, logs. **Also keep out:** `VIVA_GUIDE.md`, `viva-notes/` —
these are your own prep notes, and having a viva cheat‑sheet in the repo the examiner opens looks terrible.
They are already untracked, so a normal `git add src/...` will never include them. Just don't run `git add .`.

Check before every push:

```bash
git status          # is anything unexpected staged?
```

---

## 7. Deploying (making your changes public)

```bash
npm run build       # production build into dist/ (should finish with "✓ built in ~2s")
npm run deploy      # pushes dist/ to the gh-pages branch
```

`predeploy` runs `build` automatically, so `npm run deploy` alone is enough. Wait ~1 minute, then check
<https://gurrahmat.github.io/aura-cook/> . Hard‑refresh (`Ctrl+Shift+R`) — GitHub Pages caches aggressively.

**Do not deploy a broken build.** If `npm run build` shows a red error, it won't deploy — fix it first.

---

## 8. The errors you will actually hit

| Symptom | Cause | Fix |
|---|---|---|
| `sh: vite: not found` | dependencies not installed | `npm install` |
| Blank white page, console error | a runtime error (typo, undefined) | open browser DevTools (`F12`) → **Console** tab, read the first red line |
| "Port 3000 is in use" | an old server is still running | `npm run dev -- --port 3001`, or close the other terminal |
| Edits don't appear | file not saved / wrong folder open | `Ctrl+S`; make sure the VS Code folder is `aura-cook`, not its parent |
| `useSelector` error about context/Provider | you rendered a component outside `<Provider store={store}>` | check `src/main.jsx` |
| `Cannot find module '../store/...'` | wrong import path (case‑sensitive!) | `src/store/` not `src/Store/` |
| Hundreds of red squiggles in `node_modules` | editor noise | ignore, or `Ctrl+Shift+P` → "Reload Window" |
| `zsh: command not found: code` | the `code` shell command isn't wired up | `Cmd+Shift+P` → "Shell Command: Install 'code' command in PATH", then reopen Terminal |
| `EACCES: permission denied` writing to npm globals | something was installed with `sudo` before | **don't use sudo.** `sudo chown -R $(whoami) ~/.npm` once, or switch to `nvm` |
| `Error: EADDRINUSE :3000` | old dev server still running | `lsof -ti:3000 \| xargs kill` then `npm run dev` again |
| "cannot be opened because the developer cannot be verified" | Gatekeeper on a downloaded installer | right-click the `.pkg` → Open, or System Settings → Privacy & Security → Allow Anyway |
| `xcrun: error: invalid active developer path` | Command Line Tools got wiped by a macOS update | `xcode-select --install` again |
| `npm ERR! ERESOLVE` | old Node version | install Node LTS, delete `node_modules`, `npm install` again |

---

## 9. Showing off in the viva with DevTools

With the app open in Chrome:

1. `F12` → **Redux** tab (from the extension)
2. Click around the app — every interaction appears as an action on the left:
   `ui/pageChanged`, `pantry/itemAdded`, `timers/timerAdded`, `ui/toastAdded`
3. Click an action → the **State** pane shows the before/after, and **Diff** shows exactly what changed
4. Click the **↺ Jump** icon on an old action → time travel

That panel *is* the proof you understand your own state layer. It's the single most impressive 20 seconds you can
add to your demo: *"here's every action, here's the payload, here's the state diff."*

---

## 10. Your first 20‑minute session (do this in order)

1. Install Node + Git + VS Code; check `node -v`
2. `git clone` … `git switch arena/f920ace0-aura-cook` … `code .`
3. `npm install` → `npm run dev` → open `localhost:3000`
4. Do the §5 edit (recipe title) and watch it update
5. Open `src/store/pantrySlice.js` and `src/pages/PantryPage.jsx` side by side; find where `itemAdded` is dispatched
6. `F12` on `dispatch(itemAdded(...))` to jump into the slice — see the connection for yourself
7. Change a toast message in `src/store/store.js`, save, trigger it (add an ingredient)
8. `git status` → `git add src/store/store.js` → commit → push
9. Install Redux DevTools, add an ingredient, and watch `pantry/itemAdded` appear

By step 9 you will have edited, run, understood and shipped a change to a Redux app. That is the whole workflow.

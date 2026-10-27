# AuraCook — Project Viva‑II Prep Guide
**Front End Engineering‑II (25CSE0203) · Project Evaluation‑II · 26–30 Aug 2026**

Repo: `github.com/Gurrahmat/aura-cook` · Live: `https://gurrahmat.github.io/aura-cook/`
Stack: React 18 + Vite 5 + Bootstrap 5 + lucide-react + Context API + localStorage · 2 369 lines of source · 731 lines of custom CSS

> **How to use this guide**
> Read Part 0 (cheat sheet) the night before, Parts 1–4 once to own the narration, then drill Part 9 (Q&A) out loud. Parts 5–8 are written *rubric‑first*: each one tells you **what is in your code**, **what the examiner wants to hear**, **the trap**, and **the upgrade you can paste if asked "show me"**. Part 11 is the list of things worth fixing before you walk in.

---

## PART 0 — The one‑page cheat sheet

| Thing | Your answer |
|---|---|
| Project name | **AuraCook** — an ambient kitchen companion (recipes + guided cooking + multi‑timer + digital pantry) |
| Problem statement | Home cooks juggle a recipe page, a phone timer and a fridge in their head; they also waste food because they don't know what they can cook *right now*. AuraCook puts all three in one SPA. |
| Type of app | Single Page Application (SPA) — one `index.html`, all views rendered by React, no full page reloads |
| Build tool | **Vite 5** (esbuild dev server, Rollup production build). `npm run dev` → port 3000, `npm run build` → `dist/`, `npm run deploy` → `gh-pages` |
| Pages | 4 — `home`, `recipes`, `cooking`, `pantry` |
| Navigation | **State‑based view switching** (`currentPage` in Context + conditional render in `App.jsx`). ⚠️ No React Router yet — see Part 5 |
| Global state | **Redux Toolkit** — one store, 3 slices (`pantry` / `timers` / `ui`), read with `useSelector`, written with `dispatch` |
| Local state | 14 pieces of `useState` living inside pages/components |
| Persistence | Pantry → `localStorage` key `auracook_pantry_react` (`initialState` reads it on boot, `store.subscribe` writes it back) |
| Async state | Only HTML sanitising today. No network data layer / loading‑error states yet — see Part 6.7 |
| Forms | Controlled components + HTML5 constraint validation + sanitise‑on‑submit. Reusable field component **not** built yet — see Part 8 |
| Redux Toolkit | **Implemented** — 3 slices, `prepare` callbacks, listener middleware for side effects, memoised `createSelector`. See Part 7 |
| Styling | Bootstrap 5 utilities + a custom `style.css` with **CSS custom properties** (`:root` design tokens), glassmorphism (`backdrop-filter`), and a dark‑theme token block |
| Icons / audio | `lucide-react`, `new Audio()` for the timer bell |
| Deploy | GitHub Pages, `base: './'` in `vite.config.js` so asset URLs stay relative |
| Git | 41 commits by Gurrahmat, 2 by Rohit — commit **daily during 26–30 Aug**, the examiner opens the repo |

**Four numbers to remember:** 4 pages · 4 recipes · 1 store with 3 slices · 1 `setInterval` (inside `TimerEngine`) driving every timer.

---

## PART 1 — The pitch and the demo

### 1.1 The 60‑second pitch (memorise the beats, not the words)

> "AuraCook is a single‑page React application for home cooking. The problem: when you cook, information is scattered — recipe on a laptop, three timers on your phone, and the question 'do I even have everything?' in your head. AuraCook has four screens: a **Home** dashboard, a **Recipe Library** with search and filters, a **Cooking Mode** that walks you step by step, and a **Digital Pantry** that tracks stock, quantity and expiry.
>
> The interesting part is that the screens are not independent. The pantry lives in a **Redux Toolkit store**, so every recipe card can compute a live *pantry‑match percentage* — how much of that recipe you already own. Each step in Cooking Mode dispatches a new timer into a shared **multi-timer drawer** that keeps running while you navigate. Pantry changes are mirrored to **localStorage**, so your stock survives a refresh, and the store's **listener middleware** owns the toast queue and the timer bell, so no side effect ever enters a reducer.
>
> It's built with React 18 and Vite, styled with Bootstrap plus a custom glassmorphism design‑token stylesheet, and deployed to GitHub Pages on every push."

### 1.2 The 3‑minute demo script (rehearse the click order — never hunt for buttons)

1. **Home** → "This is the dashboard; three feature cards, and the bottom row is already pantry‑aware." Point at a card's **% Pantry Match** badge.
2. **Recipes** → type `garlic` in search → filter Category = *Main Course* → toggle **Show only "Can Make Now"** → "Filters are local state; the match percentage is derived from global pantry state."
3. Click **Details** on a card → modal lists every ingredient with a green **In Stock** / red **Missing** badge. → "This is the pantry talking, not the recipe."
4. Click **Start Cooking Mode** → step card with tools + ingredients + timer button → click **Start 6m Timer** → open the **Timers** button in the navbar → the timer is already counting inside the drawer → close the drawer → "the timer lives in the provider, so it survives page changes."
5. **Pantry** → edit an item's quantity to **0** → Save → the status flips to **Out of Stock** automatically and *every* recipe's match percentage on the right panel drops.
6. Refresh the page → pantry edit is still there → "localStorage persistence."
7. End on **Network tab / repo**: "200 KB JS, 60 KB gzipped, four commits‑per‑day cadence, deployed via GitHub Pages."

### 1.3 Division of work (they will ask “who did what”)

Answer with **features + files**, not percentages:
- Member A — Context architecture (`KitchenContext.jsx`), pantry CRUD + persistence, pantry page.
- Member B — Navigation shell (`App.jsx`, `Navbar.jsx`), recipe library + filters + detail modal.
- Member C — Cooking mode step engine, multi‑timer system (`MultiTimerDrawer.jsx`), toast system, styling system (`style.css`).
Say it as *"we paired on the context because it's the spine, and then owned vertical slices."* If someone has fewer commits, **explain the commit granularity**, don't get defensive.

---

## PART 2 — Stack and repo map

```
aura-cook/
├── index.html                  # the ONLY html file — SPA proof; <div id="root">
├── vite.config.js              # base:'./' + port 3000
├── package.json                # scripts: dev / build / lint / preview / predeploy / deploy
├── assets/images/              # 2 locally generated recipe covers (others are CDN)
└── src/
    ├── main.jsx                # createRoot + StrictMode + bootstrap css + own css
    ├── App.jsx                 # provider wrapper + page switch + always-on chrome
    ├── store/                  # THE brain - Redux Toolkit
    │   ├── store.js            # configureStore + listener middleware + localStorage subscribe
    │   ├── pantrySlice.js      # pantry CRUD, quantity clamp, auto "Out of Stock"
    │   ├── timerSlice.js       # timers + tick + running/paused/finished machine
    │   ├── uiSlice.js          # currentPage, activeRecipeId, drawer flag, toasts
    │   ├── selectors.js        # plain selectors + two memoised createSelector factories
    │   └── hooks.js            # useAppDispatch / useAppSelector
    ├── utils/
    │   ├── match.js            # computeRecipeMatch (pure function)
    │   └── sound.js            # timer bell
    ├── data/
    │   ├── recipes.js          # 4 recipes: id, meta, ingredients[], instructions[{tools, timerMinutes}]
    │   └── defaultPantry.js    # 11 starter pantry items
    ├── components/
    │   ├── Navbar.jsx          # 4 nav links + timers button with live count badge
    │   ├── RecipeCard.jsx      # presentational card + match badge + image fallback
    │   ├── RecipeDetailModal.jsx   # ingredient checklist modal
    │   ├── MultiTimerDrawer.jsx    # slide-in drawer: create/pause/reset/delete timers
    │   ├── ToastContainer.jsx      # renders the global toast queue
    │   └── TimerEngine.jsx          # dispatches timersTicked() every second
    ├── pages/
    │   ├── HomePage.jsx        # hero + 3 feature cards + 3 recipe cards
    │   ├── RecipesPage.jsx     # search + 3 filters + grid + modal
    │   ├── CookingPage.jsx     # step engine + progress bar + completion modal
    │   └── PantryPage.jsx      # table CRUD + add/edit modal form + recommendations
    └── styles/style.css        # 731 lines: tokens, glassmorphism, components, responsive
```

**Two things to say about the structure:**
1. **Layer separation:** `data/` (pure content) → `utils/` (pure logic) → `store/` (global state + reducers) → `components/` (reusable UI) → `pages/` (composition). Pages never contain business rules like "what counts as in stock"; that lives in `pantrySlice`.
2. **One store, narrow subscriptions.** Each component reads only the slice it needs with `useSelector` — `ToastContainer` subscribes to `ui.toasts`, the navbar badge to `timers.length` — so nothing is re-rendered by state it does not use. That is the concrete reason the state layer sits on Redux Toolkit instead of Context (Part 7).

---

## PART 3 — Data flow: trace one click end‑to‑end

The examiner loves this question. Pick **"Add ingredient to pantry"** and narrate it as a loop:

```
PantryPage  -- form submit -->  handleSubmit(e)  ->  e.preventDefault()
   |                              sanitise: Math.max(0, parseFloat(qty) || 0)
   |                              status auto-rule: qty===0 ? "Out of Stock" : chosen
   v
dispatch(itemAdded(fields))                 [action -> reducer]
   |
   v
pantrySlice.itemAdded  ->  prepare() generates the id, normalize() clamps the quantity
   |
   v
Immer produces a NEW items array  ->  the store notifies its subscribers
   |
   +--> every component that subscribes to pantry re-renders:
   |        the pantry table, the recommendations panel, and the RecipeCard badges
   |
   +--> store.subscribe() sees a new items reference -> localStorage.setItem(...)
   |
   +--> listener middleware catches itemAdded -> dispatch(toastAdded("Added ..."))
            -> uiSlice pushes it -> ToastContainer renders it
            -> the same listener waits 4 s -> dispatch(toastRemoved(id))
```

**Say the difference out loud:** *"In the Context version every consumer re-rendered on every provider change, including the one-second timer tick. Now each component subscribes with `useSelector` to just its slice, so a timer tick does not re-render the pantry table and a pantry edit does not re-render the toast layer."*

And the **timer** loop (say this one too, it shows you understand `useEffect`):

```
TimerEngine mounts → useEffect → setInterval(() => dispatch(timersTicked()), 1000)
                                 → cleanup: clearInterval on unmount
timersTicked() reducer: only 'running' timers lose a second (pure, no side effects)
   ↓
listener middleware hears timersTicked, reads the new state, and for every timer that
just finished and is not yet notified:
   playTimerBell() + dispatch(timerNotified(id)) + dispatch(toastAdded('Timer Alert'))
```

**Key phrase to use:** *"State lives above the components that need it, and data flows down. The only things going up are action calls. That's unidirectional data flow — the same reason Redux exists."*

---

## PART 4 — File‑by‑file, what to say

### `src/main.jsx` (11 lines)
- `ReactDOM.createRoot(document.getElementById('root')).render(...)` — React 18 concurrent root (vs legacy `ReactDOM.render`).
- `<React.StrictMode>` — dev‑only double‑invocation of render/effects to surface unsafe side effects. **Expect:** *"Why does my `useEffect` run twice?"* → StrictMode in dev, not production; it's a warning system that your effect isn't idempotent.
- `<Provider store={store}>` wraps `<App />`, so every component below it can call `useSelector` / `useDispatch`. **Expect:** *"Why does `useSelector` complain?"* -> because no `<Provider>` is above it in the tree.
- Import order matters: Bootstrap CSS **then** `style.css`, so your tokens/classes win the cascade at equal specificity.

### `src/App.jsx` (37 lines)
- `AppContent` reads exactly one value from the store: `const currentPage = useAppSelector(selectCurrentPage)`. Subscribing to that single string means the shell re-renders on navigation and nothing else.
- `<TimerEngine />` renders **nothing** (`return null`) - it exists only to own the one-second interval. A component whose only job is a side effect is a recognised pattern; say so.
- The page switch:
  ```jsx
  {currentPage === 'home'    && <HomePage />}
  {currentPage === 'recipes' && <RecipesPage />}
  {currentPage === 'cooking' && <CookingPage />}
  {currentPage === 'pantry'  && <PantryPage />}
  ```
  → exactly one page is mounted at a time; the others **unmount and lose their local state** (that's why search filters reset when you leave Recipes — be ready for that question, it's a *feature of this design*, a *bug you'd fix with Context or URL state*).
- `Navbar`, `MultiTimerDrawer`, `ToastContainer` sit **outside** the switch → they persist across pages. That is a deliberate layout decision: the timer drawer must never unmount.

### `src/store/` - the file group they will read line by line

| File | What to point at | Why it matters |
|---|---|---|
| `store.js` | `configureStore({ reducer: { pantry, timers, ui } })` | one store, three slices; RTK adds DevTools, thunk and the serialisability/immutability checks automatically |
| `store.js` | `middleware: (gdm) => gdm().prepend(listenerMiddleware.middleware)` | the listener middleware is inserted before the defaults so it sees every action |
| `store.js` | the five `startListening` blocks | toast auto-dismiss after 4 s, the timer-finished bell, and the pantry toasts - **all side effects, none inside a reducer** |
| `store.js` | `store.subscribe(...)`, comparing `items !== lastPantryItems` | persistence: writes to localStorage only when the array reference actually changes |
| `pantrySlice.js` | `initialState: { items: loadPantry() }` | reads localStorage once, when the module loads; `try/catch` guards corrupt JSON |
| `pantrySlice.js` | `itemAdded: { reducer, prepare }` | `prepare` generates the id; `normalize()` clamps the quantity and forces "Out of Stock" - **the invariant lives in the reducer, not the UI** |
| `timerSlice.js` | `timersTicked` | pure: decrements running timers, flips to `finished` at zero. No audio, no toast - that is the listener's job |
| `timerSlice.js` | `notified: false` | a flag so the bell fires exactly once per timer |
| `uiSlice.js` | `toastAdded: { reducer, prepare }` with `nanoid()` | `prepare` generates the id, so components dispatch nothing but a message |
| `uiSlice.js` | `cookingStarted` | one action sets **two** fields atomically (recipe id + page) |
| `selectors.js` | `makeSelectRecipeMatch`, `makeSelectRankedRecipes` | `createSelector` factories: memoised derived data, one cache per component instance |
| `hooks.js` | `useAppDispatch`, `useAppSelector` | two lines, but components never import `react-redux` directly, and a guard/type can be added in one place |

### `src/pages/PantryPage.jsx` (362 lines — biggest file)
- 6 separate `useState` for the form (`formName`, `formQty`, `formUnit`, `formCat`, `formExpiry`, `formStatus`) → **great place to be asked "why not one object?"** Answer: six fields, all set individually, low churn; one object would reduce `useState` count but needs `setForm(f => ({...f, name}))` spread on every change — and at 4+ fields you'd switch to `useReducer`. Show you know the trade‑off.
- `openAddModal` / `openEditModal` — **one modal, two modes**, driven by `editItem` being `null` or an object. Classic "create vs update" form pattern.
- `handleSubmit`: `preventDefault` → validate → sanitise → branch add/update → close.
- Ingredient name is a **`<select>` over `COMMON_INGREDIENTS` (31 options)** — a *data‑quality* decision: it guarantees pantry names align with recipe ingredient names, which is what makes string matching in `computeRecipeMatch` work. Choosing an ingredient auto‑fills its default unit and category. **Very strong answer if asked about validation strategy.**
- Derived `filteredPantry` (search + category, from local state) and `recipeMatches` (from the memoised `makeSelectRankedRecipes` selector, already sorted by `percent` descending so the best cook-now options float to the top).

### `src/pages/RecipesPage.jsx` (125 lines)
- Four independent filters → one derived array inside `useMemo`, combining `matchSearch && matchCategory && matchDifficulty && matchPantry`, with `[recipes, pantry, search, category, difficulty, onlyPantryMatch]` as dependencies.
- "Can make now" = `computeRecipeMatch(recipe, pantry).percent >= 70` - your threshold constant, mention it.
- Empty state (`No Recipes Found` + hint) — **say "empty state" out loud**, examiners tick that box.
- `selectedRecipeModal` in **local** `useState`, because only this page owns it - a good example of *not* putting transient UI state in the store.

### `src/pages/CookingPage.jsx` (175 lines)
- `activeRecipeId` from the store (`selectActiveRecipeId`) → `recipes.find(...)` with a `|| recipes[0]` fallback (defensive).
- `currentStepIdx` local; `progressPct = Math.round(((idx+1)/total) * 100)`.
- `handleStepNavigation(dir)`: clamps at both ends, and on the last step "Next" opens the completion modal instead of moving.
- Each step carries `tools[]`, `ingredients[]`, `timerMinutes` — that's why "Start 6m Timer" is possible: `dispatch(timerAdded({ name: 'Step 2 Timer', durationSeconds: step.timerMinutes * 60 }))`. Data‑driven UI.
- Step ingredients get a check/cross based on the live pantry → pantry state reused in three different screens.

### `src/components/MultiTimerDrawer.jsx` (128 lines)
- Overlay `div` + sliding panel, both toggled by `isTimerDrawerOpen` (`drawerOpened` / `drawerClosed` actions).
- Create form validation: `parseInt`, `if (isNaN(mins) || mins <= 0) return;` (silent guard) and `required min="1"` on the input.
- `formatTime` → `padStart(2,'0')` → `08:05`.
- Per‑timer state machine: **running → paused → finished**, with the pause button hidden once finished.
- Progress bar width = `remainingSeconds / totalSeconds * 100`.
- Preset chips (8m pasta / 12m sauce / 20m oven) = one‑tap demo.

### `src/components/RecipeCard.jsx` (59 lines)
- Presentational; receives `recipe` and optional `onOpenModal` (prop → renders **Details** button only on the Recipes page; on Home it shows the difficulty instead). Nice "optional prop / render variant" answer.
- The match comes from a **per-instance memoised selector**: `const selectMatch = useMemo(() => makeSelectRecipeMatch(), [])` then `useAppSelector(state => selectMatch(state, recipe))`. Each card keeps its own one-entry cache, so it recomputes only when that recipe or the pantry changes - a shared selector would remember only the last call and thrash.
- `onError` fallback image: `e.target.onerror = null` first to avoid an infinite error loop. Say that out loud; it's a subtle detail examiners like.

### `src/styles/style.css` (731 lines)
- **Design tokens** in `:root` (`--c-terracotta`, `--font-serif`, `--shadow-glow`, `--transition-bounce` …) → theme once, use everywhere.
- `[data-theme="dark"]` block overrides the same tokens (honest note: the toggle was removed in an earlier feature cut, so it's currently dormant — Part 10.11).
- Glassmorphism: `--glass-bg: rgba(255,255,255,.75)` + `backdrop-filter: blur(16px)`.
- Responsive: media query at the bottom (`.hero-auracook` etc.).
- Bootstrap does layout (grid, `d-flex`, spacing) and the custom sheet does identity — explain this split if asked "why not Tailwind?" (Bootstrap was already the team's comfort zone; utility classes sped up the grid; the custom layer carries the brand).

---

## PART 5 — Rubric 1: Navigation layout & page structure (7–8 marks)

### 5.1 What you actually have — say it in these words
> "We built a **single-page application with a global view state**. `currentPage` lives in the Redux `ui` slice; `App.jsx` renders exactly one page component per value; `Navbar` dispatches `pageChanged`. There are no separate HTML files and no full page reloads — `index.html` is the only document in the app. The app shell (navbar, timer drawer, toast layer) is mounted once, outside the switch, so the timers and notifications keep running while you change views."

### 5.2 The three structure decisions to defend
| Decision | Justification |
|---|---|
| Chrome outside the switch | Timer drawer + toasts are *cross‑cutting*; unmounting them would kill the 1 s interval and lose the timers |
| Navbar reads `currentPage` to set `.active` | Single source of truth; no duplicated "which page am I on" flag |
| `activeRecipeId` in the store, not a prop | Recipes page, Pantry recommendations and Home can all start cooking mode; passing the id through three layers would be prop drilling |

### 5.3 The trap — and how to win the 7–8 band
**They will say: *"The syllabus says React Router / multi‑page SPA routing with URLs. Where is it?"***

Do **not** get caught. Own it and then show mastery:

> "Correct - we currently switch views with store state, which is a legitimate SPA pattern (a *controlled view switch*), and it gives us exactly-one-page-mounted rendering and shared layout. But it has three real costs: **the URL never changes, so the browser Back button leaves the app, a refresh always drops you on Home, and you can't deep‑link a recipe.** For this evaluation I know the fix is React Router v6: routes as a layout tree, `Outlet`, `NavLink` for the active class, `useParams` for `/recipe/:id`, and `useNavigate` for the programmatic redirect when you press *Start Cooking Mode*. The `ui` slice can then drop `currentPage` entirely and keep only toasts and the drawer flag."

Then be ready to write it live (see 5.4). If you have time before 26 Aug, **migrate for real** — Part 11 shows the exact diff and it's ~40 minutes.

### 5.4 The upgrade: React Router v6 version of `App.jsx`
```jsx
// src/App.jsx  — router edition
import { Routes, Route, Navigate } from 'react-router-dom';

const AppContent = () => (
  <div className="app-layout">
    <Navbar />                       {/* stays outside <Routes> → shared shell */}
    <main className="py-3">
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/recipes"        element={<RecipesPage />} />
        <Route path="/recipes/:id"    element={<RecipeDetailPage />} />   {/* deep link */}
        <Route path="/cooking/:id"    element={<CookingPage />} />        {/* param, not context */}
        <Route path="/pantry"         element={<PantryPage />} />
        <Route path="*"               element={<NotFound />} />           {/* 404 */}
      </Routes>
    </main>
    <MultiTimerDrawer />
    <ToastContainer />
  </div>
);
```
```jsx
// main.jsx — BrowserRouter for dev… but GitHub Pages has no server-side rewrite,
// so for gh-pages we use HashRouter (or a 404.html redirect trick).
import { HashRouter } from 'react-router-dom';
<HashRouter><App /></HashRouter>
```
```jsx
// CookingPage: read the id from the URL instead of context
const { id } = useParams();
const recipe = recipes.find(r => r.id === id) ?? recipes[0];

// RecipeCard / Pantry: navigate instead of setCurrentPage
const navigate = useNavigate();
<button onClick={() => navigate(`/cooking/${recipe.id}`)}>Cook Now</button>

// Navbar: NavLink gives the active class for free
<NavLink to="/recipes" className={({ isActive }) => `nav-link-auracook ${isActive ? 'active' : ''}`}>
```

**Concepts they may probe:** `<BrowserRouter>` needs server rewrite to `index.html` (hence HashRouter on Pages) · `<Routes>` picks the single best match, first‑match semantics in v5 changed to ranking in v6 · nested routes + `<Outlet />` for a persistent sidebar · `useNavigate` vs `<Link>` vs `<Navigate>` (imperative vs declarative vs redirect) · `useSearchParams` if you'd move filters into the URL.

### 5.5 Extra credit line
> "If I put filters in the URL with `useSearchParams`, the *Recipes* page becomes shareable — `?q=garlic&difficulty=Easy` — and the filters survive a refresh. That's the real payoff of routing over a view switch."

---

## PART 6 — Rubric 2: Context API & state architecture (6–8 marks)

> **Read this first.** The app no longer uses Context API at runtime — the global state layer is Redux Toolkit (Part 7). That is *not* a problem for this criterion: the criterion is **"state architecture in React apps, global vs. local state"**, and you now have a stronger answer than a Context-only project, because you can compare the two from experience. Answer in three beats:
> 1. **Architecture:** what is global (pantry, timers, UI) vs what is local (`useState` in pages), and why (Part 6.2).
> 2. **What Context is:** `createContext` → `Provider` → `useContext`, and the exact problem it solves — prop drilling, *not* re-render frequency (6.3–6.4 below are still valid theory).
> 3. **Why we moved to Redux Toolkit:** with Context, our provider re-rendered **every** consumer once a second because of the timer tick. `useSelector` gives each component a narrow subscription, so a timer tick no longer re-renders the pantry table. That one sentence, with the migration story, is the highest-value answer in this rubric.
>
> Keep 6.1–6.9 as your **Context theory** and the "what I know about Context" material — but never describe the app as using Context today.

### 6.1 The architecture sentence
> "We split state by **ownership and reach**. Anything more than one screen needs - or anything that must survive a page change - goes in the Redux store: pantry, timers, current page, toasts. Anything only one screen reads stays in local `useState`: the search box, the filters, the open modal, the step index, the six form fields. And nothing is duplicated: the pantry is the single source of truth and every percentage badge is **derived** through a memoised selector, never stored."

### 6.2 Global vs local — memorise this table
| State | Where | Why |
|---|---|---|
| `recipes` | Context (`useState(DEFAULT_RECIPES)`, never mutated) | read by Home, Recipes, Cooking, Pantry, modals |
| `pantry` | Context + localStorage | read by 4 pages; the app's shared truth |
| `timers` | Context | must outlive page switches (drawer + navbar badge + cooking step) |
| `isTimerDrawerOpen` | Context | toggled from navbar **and** home page |
| `currentPage`, `activeRecipeId` | Context | set by navbar, cards, pantry, modals |
| `toasts` | Context | produced by every action, rendered in one fixed layer |
| `search`, `category`, `difficulty`, `onlyPantryMatch` | local `RecipesPage` | only this screen reads them |
| `selectedRecipeModal` | local `RecipesPage` | transient UI |
| `currentStepIdx`, `showCompletionModal` | local `CookingPage` | belongs to that page's lifecycle |
| form fields (`formName`…`formStatus`), `showModal`, `editItem` | local `PantryPage` | transient, reset on open/close |
| `customName`, `customMins`, `showAddForm` | local `MultiTimerDrawer` | transient |

**The rule to quote:** *"Local unless shared. And if it's shared but only adjacent, pass props — context is for state that would otherwise be prop‑drilled through components that don't use it."*

### 6.3 Why Context and not props here — the concrete argument
`computeRecipeMatch` is needed by `RecipeCard`, which is rendered by `HomePage` **and** `RecipesPage`, inside a `.map`, nested in a grid. Without context you'd thread `pantry` through `HomePage → RecipeCard` — two levels, fine — but also `RecipesPage → RecipeCard` and `PantryPage`, and every intermediate component would take a prop it never uses. Context removes the plumbing.

### 6.4 The provider pattern in four lines (they may ask you to write it)
```jsx
const KitchenContext = createContext();                 // 1. create (outside component!)
export const KitchenProvider = ({ children }) => { … }  // 2. provider holds state
export const useKitchen = () => useContext(KitchenContext);  // 3. custom hook
// 4. consume: const { pantry } = useKitchen();
```
Why the hook matters: consumers import one symbol, and you get one place to add a guard (`if (!ctx) throw new Error('useKitchen must be used within KitchenProvider')`) or to add derived values later without touching 10 files.

### 6.5 Persistence — the exact mechanism
```jsx
const [pantry, setPantry] = useState(() => {          // lazy init: reads once on mount
  const saved = localStorage.getItem('auracook_pantry_react');
  if (saved) { try { return JSON.parse(saved); } catch (e) { console.error(e); } }
  return DEFAULT_PANTRY;                              // fallback for first visit / corrupt JSON
});
useEffect(() => { localStorage.setItem('auracook_pantry_react', JSON.stringify(pantry)); }, [pantry]);
```
Say the three justifications: **lazy initialiser** (a plain `useState(read())` would hit `localStorage` on *every* render), **`try/catch`** (a user or a previous version can leave invalid JSON), **effect on `[pantry]`** (single write path, so any action automatically persists — no `save()` calls scattered in handlers).

Follow‑ups: *"Why not sessionStorage?"* → survives tab close. *"Why not a backend?"* → no auth/API in scope this semester; the shape (`id, name, quantity, unit, category, expiryDate, status`) is designed to slot into a REST/JSON server later. *"Is `localStorage` sync?"* → yes, blocking, ~5 MB quota, strings only — hence `JSON.stringify`.

### 6.6 Derived state & selectors
`computeRecipeMatch(recipe)` is a **selector** living in the context:
1. filter pantry to `status !== 'Out of Stock'` → names lowercased
2. for each recipe ingredient, does any pantry name match (bidirectional `includes`)?
3. return `{ matched, total, percent, missing }`

Nothing stores `percent` → it can never go stale. That's the phrase: **"derived, not duplicated — no synchronisation bug is possible."** Mention `useMemo` as the optimisation (`useMemo(() => computeRecipeMatch(recipe), [recipe, pantry])`).

### 6.7 Asynchronous state management, loading & error handling (syllabus topic — currently thin)
Today the app is synchronous: data is bundled, so there is no network state. **Do not pretend otherwise.** Say:

> "Because the recipe data ships with the bundle, we have no request lifecycle. The syllabus topic I'd apply next is a proper async state machine — `status: 'idle' | 'loading' | 'succeeded' | 'failed'` — plus an `error` field, rendered as a skeleton while loading, an error card with a **Retry** action on failure, and an empty state when the list is legitimately empty. Our image `onError` fallback is the one async failure path we already handle."

Then name where it plugs in: replace `useState(DEFAULT_RECIPES)` with a `useEffect(fetch('/api/recipes'))` + three guarded renders, or `createAsyncThunk` if on RTK (Part 7.3).

### 6.8 Performance: be the student who knows their own code's flaw
The provider's `value` object is **recreated on every render**, and the provider re‑renders **every second** because of the timer interval. Therefore *every* consumer re‑renders every second — even `PantryPage`, which doesn't care about timers.

The fix, in order of effort:
1. `useMemo` the value + `useCallback` each action (stops re‑render when the *identity* changes for no reason — note: not enough while `timers` itself changes every second).
2. **Split the contexts**: `PantryContext`, `TimerContext`, `UIContext` — then only the timer consumers tick.
3. Move the tick into its own provider component (`<TimerProvider>`) so the churn is isolated to that subtree.
4. Or `useReducer` + `React.memo` on `RecipeCard` so cards skip re‑render when `recipe`/`match` are unchanged.

Quote the rule: *"Context solves prop drilling, not render frequency. For frequency you need splitting, memoisation, or an external store (Redux/Zustand) with selectors."* — that sentence connects Part 6 to Part 7 and sounds like the 6–8 band.

### 6.9 `useReducer` question (they often ask)
> "Three or more related fields mutated by one event → `useReducer`. `timers` is exactly that: `create/pause/reset/delete` are four events on one entity, currently four `setTimers` calls. A `timerReducer` with typed actions would centralise the transitions, make them testable in isolation, and be a two‑line translation into Redux Toolkit's `createSlice`."

---

## PART 7 — Rubric 3: Redux Toolkit (3–5 marks) — **IMPLEMENTED**

This is now real code in the repo, not a sketch. `@reduxjs/toolkit@2.13` + `react-redux@9.3`, `src/context/KitchenContext.jsx` deleted, everything running through one store.

### 7.1 What exists, file by file

| File | Contents |
|---|---|
| `src/store/store.js` | `configureStore` with three reducers, `createListenerMiddleware` with five listeners, and a `store.subscribe` that persists the pantry |
| `src/store/pantrySlice.js` | 4 reducers — `itemAdded` (with `prepare`), `itemUpdated`, `itemDeleted`, `staplesRestored`; plus `loadPantry` / `savePantry` and the `normalize` invariant |
| `src/store/timerSlice.js` | 6 reducers — `timerAdded` (with `prepare`), `timerToggled`, `timerReset`, `timerRemoved`, `timersTicked`, `timerNotified` |
| `src/store/uiSlice.js` | 6 reducers — `pageChanged`, `cookingStarted`, `drawerOpened`, `drawerClosed`, `toastAdded` (with `prepare` + `nanoid`), `toastRemoved` |
| `src/store/selectors.js` | plain selectors + two `createSelector` factories (`makeSelectRecipeMatch`, `makeSelectRankedRecipes`) |
| `src/store/hooks.js` | `useAppDispatch`, `useAppSelector` |
| `src/components/TimerEngine.jsx` | renders `null`, owns the one-second `setInterval` → `dispatch(timersTicked())` |
| `src/utils/match.js` | `computeRecipeMatch(recipe, pantry)` — pure, called only from selectors |

**What disappeared:** `KitchenContext.jsx`, `useKitchen()`, `addToast()`, `navigateToCooking()`, `setCurrentPage()`, and the `useEffect` that wrote to localStorage.

### 7.2 The story to tell — "why Redux Toolkit?" (now a *better* question for you)
Examiners ask this because most students can't justify their choice. You can, because you have both versions in your git history:

> "We started with Context API — a provider owning the pantry, timers and UI flags. It worked, but it had a measurable flaw: the provider's `value` was a new object on every render and the timer ticked every second, so **every consumer re-rendered once per second** — the pantry table and the toast layer included, even though neither reads timers. We moved the state layer to Redux Toolkit for four concrete reasons:
> 1. **Narrow subscriptions** — `useSelector` re-renders a component only when the value it selected changes, so a timer tick no longer touches the pantry table.
> 2. **Purity** — a reducer can't run a side effect. The bell, the toast timeouts and localStorage all moved into **listener middleware**, so the state transitions became pure and testable.
> 3. **Memoised derived data** — `createSelector` gives us the match percentage and the ranked recommendation list with caching, instead of recomputing them in every card on every render.
> 4. **Tooling** — DevTools gives us the action log and time-travel, which is how we debugged the timer finish logic.
>
> The cost is ceremony: three slices, a store, two hooks. For a smaller app Context would still be the right call — that's the trade-off."

If they ask *"so was Context wrong?"* → **"No — it was right for the first version and wrong once we had a per-second state change. That's a normal refactor, not a mistake."**

### 7.3 The word list they grade you on
| Term | Your one-line answer |
|---|---|
| **Slice** | `createSlice({ name, initialState, reducers })` — generates the action types, action creators and reducer from one object |
| **Store** | `configureStore({ reducer })` — one store; adds DevTools, thunk, and the serialisability/immutability checks |
| **Action** | plain object `{ type: 'pantry/itemAdded', payload: item }`; the slice creates the creator for you |
| **Reducer** | pure `(state, action) => newState`. RTK wraps state in **Immer**, so `state.items.push(x)` is safe and still immutable |
| **`prepare`** | the callback that shapes the payload *before* the reducer runs — where we generate ids (`p_${Date.now()}`, `nanoid()`) |
| **Dispatch** | the only way to change state: `dispatch(itemAdded(fields))` |
| **`useSelector`** | subscribes to one value; re-renders only when it changes by reference |
| **`createSelector`** | memoised derived data; recomputes only when its inputs change |
| **Listener middleware** | runs side effects in response to actions, after the reducer — our bell, toast timers, persistence |
| **`Provider`** | `react-redux`'s, in `main.jsx` — must be above any component that uses `useSelector` |
| **Why RTK over legacy Redux** | no action-type constants, no `switch`, no manual spreads, DevTools + thunk preconfigured |

### 7.4 Trace one click through Redux (rehearse this)
**"Add Ingredient" in the pantry:**

1. `handleSubmit(e)` → `preventDefault` → validate/sanitise → `dispatch(itemAdded(fields))`
2. `pantry/itemAdded` — `prepare` attaches `id`, `normalize` clamps quantity and forces `"Out of Stock"` at 0
3. Immer produces a **new** `items` array; the store notifies subscribers
4. Every subscriber whose selected value changed re-renders: the table, the recommendations, the recipe badges
5. `store.subscribe` sees a new reference → `localStorage.setItem(...)`
6. Listener middleware catches `itemAdded` → `dispatch(toastAdded('Added "Garlic" to pantry'))`
7. A second listener catches `toastAdded`, `await api.delay(4000)`, then `dispatch(toastRemoved(id))`

**One sentence version:** *"component → dispatch an action → pure reducer (Immer) → store notifies → only the components that selected that data re-render; side effects happen in middleware, never in the reducer."*

### 7.5 Two details that earn the top of the band
**`prepare` callbacks.** In `uiSlice`:
```js
toastAdded: {
  reducer(state, action) { state.toasts.push(action.payload); },
  prepare(message, type = 'info') { return { payload: { id: nanoid(), message, type } }; }
}
```
Callers just `dispatch(toastAdded('Updated pantry item', 'info'))` — no id generation scattered through components. Same trick in `pantrySlice.itemAdded`.
*Why it matters:* an action must be a plain serialisable object; `prepare` is the sanctioned place to build it, so reducers stay pure and ids stay out of the UI.

**Listener middleware instead of side effects in reducers:**
```js
listenerMiddleware.startListening({
  actionCreator: timersTicked,
  effect: (action, api) => {
    const { timers } = api.getState().timers;
    timers.filter(t => t.status === 'finished' && !t.notified).forEach(timer => {
      playTimerBell();
      api.dispatch(timerNotified(timer.id));
      api.dispatch(toastAdded(`⏰ Timer Alert! "${timer.name}" completed!`, 'warning'));
    });
  }
});
```
*Why it matters:* if the bell ran inside `timersTicked`, the reducer would be impure and would ring **twice** under StrictMode's double-invocation. The `notified` flag plus a listener makes it exactly-once.

### 7.6 The known oddity — be ready for it
> **"Why is the pantry saved with `store.subscribe` and not an effect or middleware?"**
> "Because a store is not a component; there is nothing to unmount, so `subscribe` is the natural hook. We compare `items !== lastPantryItems` so we only write when the array reference really changed — otherwise the one-second timer tick would hit `localStorage` every second. The more idiomatic modern option is a listener on the three pantry actions; `subscribe` was simply the smaller change."

### 7.7 Context vs Redux vs Zustand — the comparison (they may ask)
- **Context:** built in, no dependencies, ideal for low-frequency shared values (theme, auth user, drawer flag) — no selector-level optimisation, so all consumers re-render.
- **Redux Toolkit:** opinionated, DevTools, middleware, Immer, memoised selectors — best when state changes often, several domains interact, or you want an auditable action log. More ceremony.
- **Zustand:** ~1 KB, store outside React, `useStore(selector)` gives per-selector subscriptions with no provider — the pragmatic middle.
- **Your line:** *"We used Context first, outgrew it on re-render frequency, and moved to RTK. At 10× the features I'd consider RTK Query for the async data; for a small app with no async, Zustand would give the same selector benefit with far less ceremony."*

### 7.8 If they hand you a pen
Most likely live task: **write a slice and wire it.** Practise this exact shape until you can do it in four minutes:
```js
// todosSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';
const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [] },
  reducers: {
    todoAdded: { reducer(s, a) { s.items.push(a.payload); }, prepare(text) { return { payload: { id: nanoid(), text, done: false } }; } },
    todoToggled(s, a) { const t = s.items.find(i => i.id === a.payload); if (t) t.done = !t.done; },
    todoRemoved(s, a) { s.items = s.items.filter(i => i.id !== a.payload); }
  }
});
export const { todoAdded, todoToggled, todoRemoved } = todosSlice.actions;
export default todosSlice.reducer;
```
```js
// store.js
export const store = configureStore({ reducer: { todos: todosReducer } });
// main.jsx: <Provider store={store}><App /></Provider>
// component: const items = useSelector(s => s.todos.items); const dispatch = useDispatch();
dispatch(todoAdded('buy milk'));
```
Then be ready for the follow-up: *"how do you handle async?"* → `createAsyncThunk` + `extraReducers` with `pending / fulfilled / rejected` setting `status` and `error` (Part 9, Q35).

---

## PART 8 — Rubric 4: Form handling in React (3–4 marks)

### 8.1 What you have (three real forms)
| Form | File | Controls | Validation |
|---|---|---|---|
| Add/Edit pantry item | `PantryPage.jsx` (modal) | text, number, select ×3, date | `required`, `min="0"`, `step="any"`, plus sanitise on submit |
| Custom timer | `MultiTimerDrawer.jsx` | text, number | `required min="1"` + `isNaN` / `<= 0` guard |
| (filters/search) | `RecipesPage`, `PantryPage` | text, 2 selects, 1 checkbox | controlled but unvalidated by design |

### 8.2 The pattern to describe — controlled components
> "Every input has `value={state}` and `onChange={e => setState(e.target.value)}`, so React state is the single source of truth. That gives us instant feedback, the ability to sanitise as the user types (`Math.max(0, val)` on quantity), programmatic reset by just setting the state back, and a one‑modal/two‑mode form where *edit* is literally "pre‑fill the same state". The trade‑off is a re‑render per keystroke; uncontrolled inputs + `useRef`/`FormData` would be faster but lose live validation."

**browser‑native `required` works only if you submit through a real `<form onSubmit>`** — your pantry modal and timer form both do, and you call `e.preventDefault()` so the page doesn't reload. Say that; it proves you know why Bootstrap modals usually break forms.

### 8.3 Validation strategy — the three layers (use this exact structure)
1. **Constraint validation (native):** `type="number"`, `min`, `step`, `required`, `type="date"` → free, accessible, zero code.
2. **Programmatic guards + sanitising on submit:** `if (!formName.trim()) return;` · `Math.max(0, parseFloat(qty) || 0)` → `NaN` becomes `0`, negatives clamp to `0`. Never trust the DOM.
3. **Business invariants, enforced in the state layer:** quantity `0` ⇒ status `"Out of Stock"`, enforced in `handleSubmit` **and again** inside the reducer (`normalize()` in `pantrySlice`) - *"defence in depth: even if a second UI is added later, or someone dispatches `itemAdded` directly from the console, the invariant cannot be bypassed."* That's a strong 3–4 answer.
4. **Data quality via a constrained choice:** the ingredient name is a `<select>` over 31 known ingredients, not free text — it guarantees pantry names match recipe names, which is what the matching algorithm depends on. Auto‑fills unit + category from the catalogue.

### 8.4 What's missing — say it before they find it
> "We don't yet surface **inline field‑level error messages** — we rely on the browser's native bubble plus silent guards. Nor have we extracted a **reusable `Input` component**. If validation grew (email formats, expiry in the past, duplicate ingredient detection) we'd need both, plus a `touched`/`errors` object. We do auto‑clear and reset state on open/close, which avoids stale values."

### 8.5 The reusable input component (know it, be able to write it)
```jsx
// src/components/ui/Input.jsx
export const Input = ({ label, name, type = 'text', value, onChange, error, touched, ...rest }) => (
  <div className="mb-3">
    <label className="form-label fw-bold small" htmlFor={name}>{label}</label>
    <input
      id={name} name={name} type={type} value={value}
      onChange={onChange}
      className={`form-control ${touched && error ? 'is-invalid' : ''}`}
      aria-invalid={Boolean(touched && error)}
      aria-describedby={error ? `${name}-error` : undefined}
      {...rest}
    />
    {touched && error && <div id={`${name}-error`} className="invalid-feedback">{error}</div>}
  </div>
);
```
```jsx
// a validation function + a tiny custom hook = the "reusable" story
const validate = ({ name, quantity, expiryDate }) => {
  const e = {};
  if (!name?.trim())                 e.name = 'Ingredient name is required';
  if (quantity === '' || isNaN(quantity)) e.quantity = 'Quantity must be a number';
  else if (Number(quantity) < 0)     e.quantity = 'Quantity cannot be negative';
  if (expiryDate && new Date(expiryDate) < new Date()) e.expiryDate = 'Expiry date is in the past';
  return e;
};

function useForm(initial, validateFn) {
  const [values, setValues]   = useState(initial);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setValues(v => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleBlur = e => {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(validateFn(values));
  };
  const submit = onValid => e => {
    e.preventDefault();
    const errs = validateFn(values);
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(values).map(k => [k, true])));
    if (Object.keys(errs).length === 0) { onValid(values); setValues(initial); setErrors({}); setTouched({}); }
  };
  return { values, errors, touched, handleChange, handleBlur, submit };
}
```
**Follow‑ups you must have answers to:** *controlled vs uncontrolled* (state vs DOM is source of truth; `ref`/`FormData` for file inputs and performance) · *why `htmlFor`+`id`* (label→input association / a11y) · *validation on change vs on blur vs on submit* (change = annoying red while typing; blur = good UX; submit = final gate; so validate on blur + on submit, and re‑validate on change **only after** the field was touched) · *`is-invalid` + `aria-invalid`* (Bootstrap styling + screen readers) · *why one handler for many inputs* (`name` attribute as the dynamic key) · *when to reach for a library* (React Hook Form / Formik / Zod — when forms grow and re‑render cost matters; RHF is uncontrolled by default).

---

## PART 9 — Question bank

Answers are compressed; expand in your own words. ⚠️ = most likely to be asked; 🔥 = the one that separates 5/5 from 2/5.

### A. Project & architecture
1. ⚠️ **Explain your project in 1 minute.** → Part 1.1.
2. ⚠️ **What is an SPA and how does your app qualify?** One HTML document; client‑side rendering; navigation swaps components instead of documents; no full reload; hand‑over to the API layer (here: static bundle + localStorage).
3. 🔥 **Walk me through the folder structure and why.** → Part 2: data → context → components → pages, one‑way dependency direction. Components never import from pages.
4. **Where does business logic live?** In `KitchenContext` (`computeRecipeMatch`, invariants). Pages compose; components render.
5. **Which is your most complex file and why?** `PantryPage.jsx` (362 lines): table + search + filter + dual‑mode modal form + recommendation panel; or `KitchenContext.jsx` if the focus is state.
6. **Why Vite over CRA?** esbuild‑powered dev server (startup in ms), native ESM, Rollup prod build, smaller config; CRA is deprecated/archived.
7. **What does `vite.config.js` do?** React plugin, `base: './'` so assets resolve relative on GitHub Pages (`/aura-cook/` subpath), dev server on port 3000.
8. **How is it deployed?** `npm run build` → `dist/` → `gh-pages -d dist` pushes to the `gh-pages` branch → Pages serves it. `predeploy` makes `deploy` always rebuild first.

### B. Navigation & page structure (Rubric 1)
9. ⚠️ **How does navigation work?** `currentPage` in context + conditional rendering in `App.jsx`; `Navbar` sets it, with `e.preventDefault()` on the `href="#"` anchors so no hash jump.
10. 🔥 **Where is React Router?** → Part 5.3 verbatim. Own the gap, name the three costs, then give the v6 mapping.
11. **What breaks because there's no router?** No URL per page · refresh → Home · Back button leaves the app · no deep link / shareable state · no 404 route · no scroll restoration.
12. **What's an `Outlet` for?** Nested routes render the shared layout once and swap only the child — same idea as your always‑mounted navbar/drawer.
13. **`Link` vs `<a>`?** `<a>` triggers a document request and reloads (loses all state, re‑downloads JS); `<Link>` does client‑side history push + re‑render.
14. **What happens to page local state when you switch pages?** It's destroyed — the page unmounts. That's why filters reset and why the timers *had* to be global. If you wanted filters preserved you'd lift them or put them in the URL.
15. **HashRouter vs BrowserRouter?** BrowserRouter needs server rewrites (`/recipes` → `index.html`) which Pages can't do; HashRouter uses `#/recipes` and works anywhere static.

### C. Context API & state (Rubric 2)
16. ⚠️ **What is Context API, and what problem does it solve?** A way to pass data through the tree without prop drilling: `createContext` → `Provider value` → `useContext`. It's not a state manager; it's a **transport**. The state is still `useState`/`useReducer` in the provider.
17. 🔥 **Context vs props — how do you decide?** Part 6.2. Rule: local unless shared; props for 1–2 levels and a single branch; context for cross‑cutting values read by distant branches.
18. **Why is `createContext()` called outside the component?** If it were inside, every render would create a **new** context object, so consumers would look at a different context and throw/ignore the provider.
19. **Why does `theme`/provider nesting order matter?** A consumer must be a descendant of the provider. `useKitchen()` above `<KitchenProvider>` sees `undefined` (hence the guard you'd add).
20. **What's in your context value?** 10 data + 16 functions (Part 4 table). Know both numbers roughly and the categories.
21. 🔥 **Does Context re‑render everything?** Yes — any change to the provider's `value` re‑renders all consumers, and your value is an object literal, so it changes identity on every provider render (Part 6.8). Fixes: `useMemo`, `useCallback`, splitting contexts, or an external store.
22. **Why does the provider re‑render every second?** The 1 s `setInterval` calls `setTimers`.
23. **How do you persist state?** Lazy `useState` init from `localStorage` + `useEffect` write‑back with `try/catch` (Part 6.5). Only pantry is persisted; timers reset intentionally (a stale timer after a refresh would be wrong) — *say that, it turns a gap into a design decision*.
24. **Global vs local state — give examples from your code.** Part 6.2 table.
25. 🔥 **Derived state — do you duplicate any?** No: match %, filtered lists, `progressPct`, sorted recommendations are all computed in render. "If you can compute it, don't store it."
26. **`useReducer` vs `useState`?** Part 6.9.
27. **What is `useMemo`/`useCallback`/`React.memo` good for here?** `useMemo` for `computeRecipeMatch`/filtered arrays and the context value; `useCallback` for action identities; `React.memo` on `RecipeCard` to skip re‑renders. Mention: premature memoisation is also a cost — measure first.
28. **How would you add a dark‑mode toggle?** `const [theme,setTheme] = useState('light')` in context; `useEffect` → `document.documentElement.setAttribute('data-theme', theme)`; tokens already exist in `:root` and `[data-theme="dark"]`, so nothing else changes. (Mention this — the CSS block is already there.)

### D. Redux Toolkit (Rubric 3)
29. ⚠️ **Why Redux Toolkit — and why not just Context?** Part 7.2. Short version: Context re-rendered **every** consumer on every provider change, and our provider changed once per second (the timer). `useSelector` gives narrow subscriptions, middleware keeps reducers pure, `createSelector` memoises derived data, and DevTools gives an action log.
30. 🔥 **What is a slice?** `createSlice({ name, initialState, reducers })` — one object that generates the action types, the action creators and the reducer. Ours are `pantry`, `timers` and `ui`.
31. **What is `prepare` for, and where do you use it?** It shapes the payload *before* the reducer runs — we use it to generate ids (`p_${Date.now()}`, `nanoid()`), so components dispatch only real data and the reducer stays deterministic.
32. **Why is Immer allowed to "mutate"?** It wraps state in a Proxy draft and produces an immutable copy from your mutations. Outside a slice you must be immutable yourself, with spreads like `[...prev, item]` and `prev.map(...)`.
33. **What does `configureStore` add?** DevTools, `redux-thunk`, development-time serialisability + immutability checks, `combineReducers` and `preloadedState` support.
34. **`useSelector` vs `useContext`?** `useContext` subscribes to the whole value, so any change re-renders every consumer. `useSelector(s => s.ui.toasts)` subscribes to one value and re-renders only when it changes by reference. That difference is exactly why we migrated.
35. **Async flow in RTK?** Component → `dispatch(fetchRecipes())` → the thunk calls the API → dispatches `pending`, then `fulfilled` or `rejected` → `extraReducers` writes `status` / `data` / `error` → the component renders a skeleton, an error card with Retry, or the list. We have no async yet; that is the next step (Part 6.7).
36. **What is your listener middleware actually doing?** Five listeners: toast auto-dismiss after 4 s, the timer bell when `timersTicked` finishes a timer, and one toast each for `itemAdded` / `itemUpdated` / `itemDeleted` / `staplesRestored`. That is how reducers stay pure.
37. **Zustand in one line?** ~1 KB store outside React, `create()`, `useStore(s => s.slice)` per-selector subscription, no provider.

### E. Forms (Rubric 4)
38. ⚠️ **Controlled vs uncontrolled?** Part 8.2. Then: *"files can't be controlled — use `ref` or `FormData`."*
39. 🔥 **What is your validation strategy?** The four layers of Part 8.3.
40. **Why `e.preventDefault()`?** Otherwise the browser does a full form submit (page navigation) and you lose the SPA state. Also required for native validation to trigger through your handler.
41. **How do you handle a number field that shouldn't go negative?** `min="0"` + `Math.max(0, parseFloat(v) || 0)` on change **and** sanitise again on submit + the state layer clamps — never trust one layer.
42. **One form for add and edit — how?** `editItem === null` ⇒ create; otherwise pre-fill from the item and `dispatch(itemUpdated({ id, fields }))`. Reset state in `openAddModal`/`openEditModal` so nothing leaks between sessions.
43. **How would you make inputs reusable?** Part 8.5 (`Input` component + `useForm` hook + `validate` function).
44. **Validation timing?** On blur + on submit; re‑validate on change only after `touched` (otherwise the user sees red while typing).
45. **What about accessibility?** `<label htmlFor>` ↔ `id`, `aria-invalid`, `aria-describedby` pointing at the error text, `role="alert"`, keyboard focus order, `btn-close` with `aria-label`.

### F. Hooks & React fundamentals (they always warm up here)
46. **`useState` vs `useEffect` in one sentence each.** State = memory across renders that triggers re‑render; Effect = run side effects after render, with a dependency array + cleanup.
47. 🔥 **Why functional updates `setX(prev => …)`?** Reads the latest value, so it is safe under batching and stale closures. **In the Redux version you no longer need it for the timers** - `timersTicked` gets the current state from the store - which is exactly the class of bug a reducer removes. It still matters for plain `useState`, e.g. `setCurrentStepIdx(prev => ...)`.
48. **What does the dependency array really do?** Compares by `Object.is` after each render; `[]` = mount only, omitted = every render; returning a function = cleanup before the next run and on unmount.
49. **Why does the timer interval get cleaned up?** Otherwise a second interval stacks up on re‑mount (double speed) and you leak memory.
50. 🔥 **React 18 batching / StrictMode double effects.** Batched updates in event handlers *and* promises/timeouts in 18; StrictMode mounts→unmounts→mounts in dev so a missing cleanup is exposed. Our *first* version called `playTimerBell()` and `addToast()` **inside a `setTimers` updater** - a genuine anti-pattern, and one StrictMode can double-fire. The Redux migration fixed it properly: the reducer is pure, and the bell plus the toast live in listener middleware (Part 10.2). Telling that story - flaw, why it was wrong, how it was fixed - is stronger than never having had the flaw.
51. **Keys in lists — why `recipe.id` and not the index?** Stable identity so React reuses the right DOM node; index keys break on reorder/insert.
52. **`&&` rendering gotcha?** `{count && <X/>}` renders `0` when count is 0 → use `count > 0 && …` or a ternary.
53. **Lifting state up?** Move state to the closest common ancestor. That is what we did with the pantry: it was needed four screens deep, so it went to the store; `selectedRecipeModal` is needed by one page, so it stayed local.
54. **`React.memo` vs `useMemo` vs `useCallback`?** Component vs value vs function identity.
55. **What's a "controlled view switch" advantage over routing?** No dependency, deterministic single‑mount, easy to gate on app state (e.g. a wizard). Cost: no URLs.

### G. Git & GitHub (they will open the repo)
56. ⚠️ **Show your commit history.** 41 commits (Gurrahmat) + 2 (Rohit), feature‑sized messages ("enforce non‑negative quantity validation…", "style step ingredients with dark badge…"). Point at *small atomic commits* — that's the rubric's "regular updates / individual contribution" check.
57. **Branch strategy?** `main` is the trunk, deployed via `gh-pages`; feature work on short branches then merged. Be ready to say what you *should* be doing: `feat/pantry-validation` → PR → review → merge.
58. **What's in `.gitignore` and why?** `node_modules`, `dist`, logs, editor dirs — build output is reproducible, dependencies are locked in `package-lock.json`.
59. **Should `package-lock.json` be committed?** Yes — deterministic installs.
60. **What did you fix in that specific commit?** Pick 3 commits and know the *reason*. Best candidates: `enforce non-negative quantity validation…`, `restrict pantry ingredient name to database dropdown list strictly`, `update recipe images … with fallback handler`. Each has a one‑sentence "why".
61. **If a teammate's commit is broken, how do you find it?** `git log --oneline`, `git bisect`, `git show <sha>`, `git diff main...branch`.
62. **How do you undo a pushed commit safely?** `git revert` (new commit) vs `git reset --hard` locally only; never rewrite shared history.
63. **What's the deployed URL and how is it wired?** `gurrahmat.github.io/aura-cook/` ← `gh-pages` branch ← `npm run deploy`.

### H. Killer / open‑ended questions
64. 🔥 **"What is the weakest part of your project?"** Answer with the *fix* attached: (a) no URL routing → migrate to React Router v6 with HashRouter on Pages; (b) timer accuracy — decrementing a counter drifts, should store `endsAt` and compute `Math.max(0, endsAt - Date.now())`; (c) no async lifecycle → add `status/error` state machine + skeletons and a retry; (d) no automated tests. Pick **two** and be specific — vagueness reads as "I don't know my code".
65. 🔥 **"If I tell you to add a feature, what do you touch?"** Template: new data field in `data/` → new action/derived value in `KitchenContext` → a UI component → a page that composes it → a commit per step. If they say "add a shopping list from missing ingredients": `missing[]` already exists in `computeRecipeMatch`; → `shoppingList` array in context + `addMissingToShoppingList(recipeId)` + a drawer/badge. **Have that answer ready — it's the most natural extension and it uses code you already wrote.**
66. **"Scale to 500 recipes — what breaks?"** Matching runs per card per render (`O(cards × ingredients × pantry)`) → `useMemo` per recipe, virtualise the grid (`react-window`), move matching into the data layer/cache by pantry version, paginate/async‑fetch.
67. **"Why not a backend?"** No auth/API in scope; schema is API‑ready; swapping `localStorage` for `fetch` is localised to the provider (and would then need loading/error states — Part 6.7).
68. **"Which part are you most proud of?"** The pantry‑match derived selector — it's the feature that makes the four screens one product instead of four pages, and it's pure, testable, and duplicated nowhere.
69. **"What did you learn?"** Unidirectional data flow; why "derived over stored"; that Context solves prop drilling but not render frequency; and that a design‑token stylesheet is cheaper to maintain than scattered inline styles.

---

## PART 10 — Known weaknesses & how to answer them (don't be surprised)

| # | Weakness | Honest defence | Fix (effort) |
|---|---|---|---|
| 10.1 | **No URL routing** (biggest rubric risk, 7–8 band) | Part 5.3 | React Router v6 + HashRouter (**~40 min**) |
| 10.2 | ~~`playTimerBell()` and `addToast()` inside the `setTimers` updater~~ - **FIXED** by the Redux migration | "Our first version fired the bell and the toast from inside a state updater. That's a side effect during state computation, and StrictMode can run an updater twice, so it could double-fire. It now lives in listener middleware with a `notified` flag, so it fires exactly once." | done |
| 10.3 | **Timer drift**: `remainingSeconds - 1` every tick ignores throttled/background tabs | Decrement counters drift; store an absolute `endsAt` and derive the remaining time | Convert to `endsAt` + `Date.now()` (**~20 min**) |
| 10.4 | ~~The provider re-rendered the whole tree every second~~ - **FIXED** by the migration to `useSelector` subscriptions | "Each component now subscribes to one slice, so a timer tick re-renders only the parts that read timers." | done |
| 10.5 | ~~`computeRecipeMatch` recomputed in every card's render~~ - **FIXED** with `createSelector` | "Each card gets a per-instance memoised selector, so it recomputes only when that recipe or the pantry changes." | done |
| 10.6 | Ingredient matching is bidirectional substring → false positives ("Garlic" ⊂ "Garlic Powder", "Salt" ⊂ "Sea Salt") | Cheap and forgiving of naming variants like "Cherry Tomatoes"/"Tomatoes"; a stricter version normalises to IDs | Add a normalized `slug` on both sides (**~20 min**) |
| 10.7 | Persisted: pantry only. Timers/flags reset | Intentional for timers; would persist `timers` with `endsAt` if we wanted crash recovery | — |
| 10.8 | No async/loading/error states (syllabus topic) | Part 6.7 | Add a `status` machine around recipe loading (**~30 min**) |
| 10.9 | No reusable input component / inline errors | Part 8.4 + 8.5 | Extract `Input` + `useForm` (**~30 min**) |
| 10.10 | No tests, `npm run lint` errors out (eslint v10 needs a flat `eslint.config.js`, which is missing) | "We haven't wired tooling yet; the build is green and Vite's build is our gate." | Add `eslint.config.js` (**~10 min**) or stop advertising `lint` |
| 10.11 | `[data-theme="dark"]` tokens exist but no toggle (feature was cut) | Part 9.27 — 10 minutes to wire up | `theme` in context + `setAttribute` |
| 10.12 | Repo **description** still mentions voice navigation & soundscapes that were removed | Say: "cut in commit *remove ambient music and soundscape features* — scope control." Better: update the description + README | **2 min**, do it |
| 10.13 | README is 2 lines | Rubric says repo is reviewed — a README with problem statement, stack, screenshots, setup, deploy, team is worth real marks | **20 min**, do it |

---

## PART 11 — Do these before 26 August (ranked by marks per minute)

**Tier 1 — highest marks per minute (≈1 hour total)**
1. **README upgrade** (Part 10.13): problem statement, features, stack, folder structure, `npm install/dev/build/deploy`, live link, team + module ownership, screenshots. Update repo description (10.12).
2. **Add `eslint.config.js`** so `npm run lint` actually runs (or delete the script).
3. ~~Memoise the context value~~ - superseded: the migration to `useSelector` removed that whole class of problem (10.4). Spend this time writing the store walkthrough from Part 7.4 on a blank page instead.
4. **Commit every day** from 26–30 Aug, in small feature commits, both members. The rubric explicitly reads version history; a gap since 25 Aug is visible.

**Tier 2 — closes the two real rubric gaps (≈70 min)**
5. **React Router v6 migration** (Part 5.4) with `HashRouter` (Pages‑safe): `/`, `/recipes`, `/cooking/:id`, `/pantry`, `*` → NotFound. Replace `pageChanged` / `cookingStarted` with `useNavigate` and `useParams`, and drop `currentPage` from the `ui` slice. **This alone is the difference between 3–5 and 7–8 on criterion 1.**
6. **Reusable form layer** (Part 8.5): `components/ui/Input.jsx` + `useForm` hook + a `validate` function; use it inside the pantry modal so every field gets an inline error. That converts criterion 4 from "moderate" to "excellent".

**Tier 3 — depth if you have time**
7. Timer accuracy (10.3): the bell/toast anti-pattern is already gone; the remaining gap is drift. Converting to `endsAt` + `Date.now()` is a ~20 minute change and a genuinely impressive answer to "is your timer accurate?".
8. ~~RTK demo slice on a scratch branch~~ - **already implemented** (Part 7). Instead: practise writing a todos slice from memory in four minutes (Part 7.8), because that is the live task they are most likely to set.

---

## PART 12 — Day‑of checklist

**Have open in tabs:** the deployed site · the repo's commit history (`/commits/main`) · `KitchenContext.jsx` · `App.jsx` · `PantryPage.jsx` · `package.json` · the Network tab after a hard refresh (200 KB / ~60 KB gzip).

**Say these sentences at least once** — they're the rubric in disguise:
1. "One HTML file, all views rendered by React — it's an SPA."
2. "State is split by ownership: shared → Context, transient → local component state."
3. "The pantry is the single source of truth; the match percentage is **derived**, never stored."
4. "Context solves prop drilling, not render frequency — that's exactly why we moved the state layer to Redux Toolkit, where `useSelector` gives narrow subscriptions."
5. "Validation is layered: native constraints, sanitising on submit, invariants in the state layer."
6. "We started on Context, outgrew it on re-render frequency, and migrated to Redux Toolkit — three slices, listener middleware for side effects, `createSelector` for derived data."
7. "Known gap: the URL doesn't change — React Router v6 fixes it, and here's the migration."
8. "Reducers are pure; side effects live in listener middleware. DevTools shows every action."
9. "Everything is committed in small feature commits; deploy is `npm run deploy` to gh-pages."

**Do not:** claim features that were removed (voice navigation, soundscapes) · say "AI wrote it" · leave the repo uncommitted for the last week · demo from an editor console instead of the running app · let one member answer every question (each of you takes two rubric areas).

---

### Rubric self‑check

| Criterion | Marks | Where you stand today | What pushes you up |
|---|---|---|---|
| Navigation layout & page structure | 7–8 | Solid SPA shell, one‑mount‑per‑view, persistent chrome — **but no router/URLs** | Router migration (Part 5.4, 11.5) |
| Context API & state architecture | 6–8 | Very strong: clear local-vs-global split, persistence, derived selectors - **and** you can compare Context with Redux from experience, which almost no one else can | Be fluent in Part 6's three-beat answer; mention the async status machine |
| Redux Toolkit | 3–5 | **Implemented for real**: 3 slices, `prepare` callbacks, listener middleware, memoised `createSelector`, DevTools | Be able to write a slice from memory (Part 7.8) and tell the migration story (7.2) |
| Form handling | 3–4 | Controlled forms, native + programmatic validation, add/edit single modal, constrained catalogue | Reusable `Input` + inline errors (Part 8.5) |
| Presentation (5) | — | Structure + demo order + no hunting for buttons | Parts 1.2 & 1.3 |

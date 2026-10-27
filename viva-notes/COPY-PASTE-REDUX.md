# Copy-paste Redux kit - AuraCook
Paste these in order into your existing `aura-cook` folder in VS Code. At the end the app runs on
Redux Toolkit and `src/context/` no longer exists.

**Not touched:** `index.html`, `vite.config.js`, `package.json` scripts, `src/data/recipes.js`,
`src/data/defaultPantry.js`, `src/styles/style.css`, `assets/`. The `npm install` in step 1 edits `package.json` for you.

---

## The whole job at a glance

| # | Step | Count |
|---|---|---|
| 1 | `npm install @reduxjs/toolkit react-redux` | 1 command |
| 2 | delete `src/context/KitchenContext.jsx` | 1 file |
| 3 | create new files | 9 |
| 4 | replace existing files (`Cmd+A`, paste, `Cmd+S`) | 11 |
| 5 | `npm run dev` and verify | 6 checks |

> Faster alternative, if you ever want it: `git switch arena/f920ace0-aura-cook && git pull` gives you all 20
> files in one command (already committed and pushed). This page is for pasting by hand.

---

## Step 1 - install the two packages

In the VS Code terminal (`Ctrl+` backtick), inside the `aura-cook` folder:

```bash
npm install @reduxjs/toolkit react-redux
```

Expect `added N packages`. `package.json` should then contain:

```json
"@reduxjs/toolkit": "^2.13.0",
"react-redux": "^9.3.0"
```

---

## Step 2 - delete the old state layer

Delete `src/context/KitchenContext.jsx` (and the empty `src/context` folder). In the terminal:

```bash
rm src/context/KitchenContext.jsx
rmdir src/context
```

Nothing imports it after step 4, so the app stops compiling only until you finish step 4 - that is expected.

---

## Step 3 - create 9 new files

In the VS Code sidebar: right-click `src` → **New Folder** → name it `store`. Then for each file below:
right-click the target folder → **New File** → type the name → paste the code → `Cmd+S`.

- [ ] `src/utils/match.js` (new folder `utils`)
- [ ] `src/utils/sound.js`
- [ ] `src/store/pantrySlice.js`
- [ ] `src/store/timerSlice.js`
- [ ] `src/store/uiSlice.js`
- [ ] `src/store/selectors.js`
- [ ] `src/store/hooks.js`
- [ ] `src/store/store.js`
- [ ] `src/components/TimerEngine.jsx`

### 3.1  `src/utils/match.js`

*the matching maths as a pure function*

```js
export const computeRecipeMatch = (recipe, pantry) => {
  const inStock = pantry
    .filter(item => item.status !== 'Out of Stock')
    .map(item => item.name.toLowerCase());

  let matched = 0;
  const missing = [];

  recipe.ingredients.forEach(ingredient => {
    const name = ingredient.name.toLowerCase();
    const available = inStock.some(p => p.includes(name) || name.includes(p));
    if (available) matched += 1;
    else missing.push(ingredient.name);
  });

  const total = recipe.ingredients.length || 1;
  return { matched, total, percent: Math.round((matched / total) * 100), missing };
};
```

### 3.2  `src/utils/sound.js`

*the timer bell*

```js
export const playTimerBell = () => {
  try {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(() => {});
  } catch (e) {}
};
```

### 3.3  `src/store/pantrySlice.js`

*pantry state: add / update / delete / restore*

```js
import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_PANTRY } from '../data/defaultPantry';

const STORAGE_KEY = 'auracook_pantry_react';

const clampQuantity = (value) => Math.max(0, parseFloat(value) || 0);

const normalize = (item) => {
  const quantity = clampQuantity(item.quantity);
  return {
    ...item,
    quantity,
    status: quantity === 0 ? 'Out of Stock' : (item.status || 'In Stock')
  };
};

export const loadPantry = () => {
  if (typeof localStorage === 'undefined') return DEFAULT_PANTRY;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error('Could not read the saved pantry', error);
  }
  return DEFAULT_PANTRY;
};

export const savePantry = (items) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Could not save the pantry', error);
  }
};

const pantrySlice = createSlice({
  name: 'pantry',
  initialState: { items: loadPantry() },
  reducers: {
    itemAdded: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(item) {
        return { payload: normalize({ ...item, id: `p_${Date.now()}` }) };
      }
    },
    itemUpdated(state, action) {
      const { id, fields } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = normalize({ ...state.items[index], ...fields });
      }
    },
    itemDeleted(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    staplesRestored(state) {
      state.items = DEFAULT_PANTRY;
    }
  }
});

export const { itemAdded, itemUpdated, itemDeleted, staplesRestored } = pantrySlice.actions;
export default pantrySlice.reducer;
```

### 3.4  `src/store/timerSlice.js`

*timers state: add / toggle / reset / remove / tick*

```js
import { createSlice } from '@reduxjs/toolkit';

const timerSlice = createSlice({
  name: 'timers',
  initialState: { timers: [] },
  reducers: {
    timerAdded: {
      reducer(state, action) {
        state.timers.push(action.payload);
      },
      prepare({ name, durationSeconds }) {
        return {
          payload: {
            id: `timer_${Date.now()}`,
            name: name || 'Kitchen Timer',
            totalSeconds: durationSeconds,
            remainingSeconds: durationSeconds,
            status: 'running',
            notified: false
          }
        };
      }
    },
    timerToggled(state, action) {
      const timer = state.timers.find(t => t.id === action.payload);
      if (!timer) return;
      if (timer.status === 'running') timer.status = 'paused';
      else if (timer.remainingSeconds > 0) timer.status = 'running';
      else timer.status = 'finished';
    },
    timerReset(state, action) {
      const timer = state.timers.find(t => t.id === action.payload);
      if (!timer) return;
      timer.remainingSeconds = timer.totalSeconds;
      timer.status = 'paused';
      timer.notified = false;
    },
    timerRemoved(state, action) {
      state.timers = state.timers.filter(t => t.id !== action.payload);
    },
    timersTicked(state) {
      state.timers.forEach(timer => {
        if (timer.status !== 'running') return;
        timer.remainingSeconds = Math.max(0, timer.remainingSeconds - 1);
        if (timer.remainingSeconds === 0) timer.status = 'finished';
      });
    },
    timerNotified(state, action) {
      const timer = state.timers.find(t => t.id === action.payload);
      if (timer) timer.notified = true;
    }
  }
});

export const {
  timerAdded,
  timerToggled,
  timerReset,
  timerRemoved,
  timersTicked,
  timerNotified
} = timerSlice.actions;

export default timerSlice.reducer;
```

### 3.5  `src/store/uiSlice.js`

*page, active recipe, drawer, toasts*

```js
import { createSlice, nanoid } from '@reduxjs/toolkit';
import { DEFAULT_RECIPES } from '../data/recipes';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentPage: 'home',
    activeRecipeId: DEFAULT_RECIPES[0].id,
    isTimerDrawerOpen: false,
    toasts: []
  },
  reducers: {
    pageChanged(state, action) {
      state.currentPage = action.payload;
    },
    cookingStarted(state, action) {
      state.activeRecipeId = action.payload;
      state.currentPage = 'cooking';
    },
    drawerOpened(state) {
      state.isTimerDrawerOpen = true;
    },
    drawerClosed(state) {
      state.isTimerDrawerOpen = false;
    },
    toastAdded: {
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare(message, type = 'info') {
        return { payload: { id: nanoid(), message, type } };
      }
    },
    toastRemoved(state, action) {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    }
  }
});

export const {
  pageChanged,
  cookingStarted,
  drawerOpened,
  drawerClosed,
  toastAdded,
  toastRemoved
} = uiSlice.actions;

export default uiSlice.reducer;
```

### 3.6  `src/store/selectors.js`

*read helpers + memoised selectors*

```js
import { createSelector } from '@reduxjs/toolkit';
import { DEFAULT_RECIPES } from '../data/recipes';
import { computeRecipeMatch } from '../utils/match';

export const selectRecipes = () => DEFAULT_RECIPES;

export const selectPantryItems = (state) => state.pantry.items;
export const selectTimers = (state) => state.timers.timers;
export const selectTimerCount = (state) => state.timers.timers.length;
export const selectToasts = (state) => state.ui.toasts;
export const selectCurrentPage = (state) => state.ui.currentPage;
export const selectActiveRecipeId = (state) => state.ui.activeRecipeId;
export const selectIsTimerDrawerOpen = (state) => state.ui.isTimerDrawerOpen;

export const makeSelectRecipeMatch = () =>
  createSelector(
    [(state, recipe) => recipe, selectPantryItems],
    (recipe, pantry) => computeRecipeMatch(recipe, pantry)
  );

export const makeSelectRankedRecipes = () =>
  createSelector(
    [selectRecipes, selectPantryItems],
    (recipes, pantry) =>
      recipes
        .map(recipe => ({ recipe, match: computeRecipeMatch(recipe, pantry) }))
        .sort((a, b) => b.match.percent - a.match.percent)
  );
```

### 3.7  `src/store/hooks.js`

*useAppDispatch / useAppSelector*

```js
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
```

### 3.8  `src/store/store.js`

*configureStore + listener middleware + persistence*

```js
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import pantryReducer, { itemAdded, itemUpdated, itemDeleted, staplesRestored, savePantry } from './pantrySlice';
import timerReducer, { timersTicked, timerNotified } from './timerSlice';
import uiReducer, { toastAdded, toastRemoved } from './uiSlice';
import { playTimerBell } from '../utils/sound';

const listenerMiddleware = createListenerMiddleware();

const TOAST_LIFETIME_MS = 4000;

listenerMiddleware.startListening({
  actionCreator: toastAdded,
  effect: async (action, api) => {
    await api.delay(TOAST_LIFETIME_MS);
    api.dispatch(toastRemoved(action.payload.id));
  }
});

listenerMiddleware.startListening({
  actionCreator: timersTicked,
  effect: (action, api) => {
    const { timers } = api.getState().timers;
    timers
      .filter(timer => timer.status === 'finished' && !timer.notified)
      .forEach(timer => {
        playTimerBell();
        api.dispatch(timerNotified(timer.id));
        api.dispatch(toastAdded(`⏰ Timer Alert! "${timer.name}" completed!`, 'warning'));
      });
  }
});

listenerMiddleware.startListening({
  actionCreator: itemAdded,
  effect: (action, api) => {
    api.dispatch(toastAdded(`Added "${action.payload.name}" to pantry`, 'success'));
  }
});

listenerMiddleware.startListening({
  actionCreator: itemUpdated,
  effect: (action, api) => {
    api.dispatch(toastAdded('Updated pantry item', 'info'));
  }
});

listenerMiddleware.startListening({
  actionCreator: itemDeleted,
  effect: (action, api) => {
    api.dispatch(toastAdded(`Removed "${action.payload.name}" from pantry`, 'info'));
  }
});

listenerMiddleware.startListening({
  actionCreator: staplesRestored,
  effect: (action, api) => {
    api.dispatch(toastAdded('Restored common kitchen staples to pantry', 'success'));
  }
});

export const store = configureStore({
  reducer: {
    pantry: pantryReducer,
    timers: timerReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware)
});

let lastPantryItems = store.getState().pantry.items;

store.subscribe(() => {
  const items = store.getState().pantry.items;
  if (items !== lastPantryItems) {
    lastPantryItems = items;
    savePantry(items);
  }
});
```

### 3.9  `src/components/TimerEngine.jsx`

*owns the 1-second interval*

```js
import React, { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { timersTicked } from '../store/timerSlice';

export const TimerEngine = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => dispatch(timersTicked()), 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};
```

---

## Step 4 - replace 11 existing files

For each: open the file, `Cmd+A`, `Backspace`, paste the whole block, `Cmd+S`.

- [ ] `src/main.jsx`
- [ ] `src/App.jsx`
- [ ] `src/components/Navbar.jsx`
- [ ] `src/components/ToastContainer.jsx`
- [ ] `src/components/RecipeCard.jsx`
- [ ] `src/components/RecipeDetailModal.jsx`
- [ ] `src/components/MultiTimerDrawer.jsx`
- [ ] `src/pages/HomePage.jsx`
- [ ] `src/pages/RecipesPage.jsx`
- [ ] `src/pages/CookingPage.jsx`
- [ ] `src/pages/PantryPage.jsx`

### 4.1  `src/main.jsx`

*adds <Provider store={store}>*

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { store } from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
```

### 4.2  `src/App.jsx`

*reads currentPage from the store, mounts TimerEngine*

```jsx
import React from 'react';
import { useAppSelector } from './store/hooks';
import { Navbar } from './components/Navbar';
import { MultiTimerDrawer } from './components/MultiTimerDrawer';
import { ToastContainer } from './components/ToastContainer';
import { TimerEngine } from './components/TimerEngine';
import { HomePage } from './pages/HomePage';
import { RecipesPage } from './pages/RecipesPage';
import { CookingPage } from './pages/CookingPage';
import { PantryPage } from './pages/PantryPage';
import { selectCurrentPage } from './store/selectors';

const AppContent = () => {
  const currentPage = useAppSelector(selectCurrentPage);

  return (
    <div className="app-layout">
      <TimerEngine />
      <Navbar />

      <main className="py-3">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'recipes' && <RecipesPage />}
        {currentPage === 'cooking' && <CookingPage />}
        {currentPage === 'pantry' && <PantryPage />}
      </main>

      <MultiTimerDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
```

### 4.3  `src/components/Navbar.jsx`

*dispatch(pageChanged) + timer count from the store*

```jsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { drawerOpened, pageChanged } from '../store/uiSlice';
import { selectCurrentPage, selectTimerCount } from '../store/selectors';
import { Utensils, Home, BookOpen, Flame, Box, Timer } from 'lucide-react';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector(selectCurrentPage);
  const timerCount = useAppSelector(selectTimerCount);

  const links = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'recipes', label: 'Recipes', Icon: BookOpen },
    { id: 'cooking', label: 'Cooking Mode', Icon: Flame },
    { id: 'pantry', label: 'Pantry', Icon: Box }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-auracook">
      <div className="container-fluid">
        <a
          className="navbar-brand-auracook"
          href="#"
          onClick={(e) => { e.preventDefault(); dispatch(pageChanged('home')); }}
        >
          <Utensils className="me-2" /> AuraCook
        </a>

        <div className="collapse navbar-collapse show" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            {links.map(({ id, label, Icon }) => (
              <li className="nav-item" key={id}>
                <a
                  className={`nav-link-auracook ${currentPage === id ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => { e.preventDefault(); dispatch(pageChanged(id)); }}
                >
                  <Icon size={18} /> {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-auracook-secondary btn-toggle-timer position-relative"
              onClick={() => dispatch(drawerOpened())}
            >
              <Timer size={18} className="me-1" /> Timers
              <span className="badge-timer-count ms-2">{timerCount}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
```

### 4.4  `src/components/ToastContainer.jsx`

*reads toasts from the store*

```jsx
import React from 'react';
import { useAppSelector } from '../store/hooks';
import { selectToasts } from '../store/selectors';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const ToastContainer = () => {
  const toasts = useAppSelector(selectToasts);

  return (
    <div className="toast-container-auracook">
      {toasts.map(toast => {
        let IconComponent = Info;
        if (toast.type === 'success') IconComponent = CheckCircle;
        if (toast.type === 'warning') IconComponent = AlertTriangle;

        return (
          <div key={toast.id} className={`auracook-toast toast-${toast.type}`}>
            <IconComponent size={20} />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
```

### 4.5  `src/components/RecipeCard.jsx`

*memoised match selector + dispatch(cookingStarted)*

```jsx
import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cookingStarted } from '../store/uiSlice';
import { makeSelectRecipeMatch } from '../store/selectors';
import { Clock, Signal, Flame, Eye } from 'lucide-react';

export const RecipeCard = ({ recipe, onOpenModal }) => {
  const dispatch = useAppDispatch();
  const selectMatch = useMemo(() => makeSelectRecipeMatch(), []);
  const match = useAppSelector(state => selectMatch(state, recipe));

  let badgeClass = "badge-match-high";
  if (match.percent < 70 && match.percent >= 40) badgeClass = "badge-match-med";
  if (match.percent < 40) badgeClass = "badge-match-low";

  return (
    <div className="glass-card h-100 d-flex flex-column">
      <div className="recipe-card-img-wrapper">
        <img
          src={recipe.image}
          className="recipe-card-img"
          alt={recipe.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="recipe-badge-time">
          <Clock size={14} className="me-1" /> {recipe.cookTime + recipe.prepTime} mins
        </div>
        <div className={`recipe-badge-pantry ${badgeClass}`}>
          {match.percent}% Pantry Match
        </div>
      </div>

      <div className="recipe-card-body">
        <h5 className="font-serif mb-2">{recipe.title}</h5>
        <p className="text-muted small flex-grow-1">{recipe.description}</p>

        <div className="mb-3">
          {recipe.tags.map((t, idx) => (
            <span key={idx} className="tag-pill">{t}</span>
          ))}
        </div>

        <div className="d-flex align-items-center justify-content-between pt-3 border-top gap-2">
          {onOpenModal ? (
            <button className="btn btn-sm btn-outline-secondary" onClick={() => onOpenModal(recipe)}>
              <Eye size={14} className="me-1" /> Details
            </button>
          ) : (
            <small className="text-muted"><Signal size={14} className="me-1" />{recipe.difficulty}</small>
          )}

          <button className="btn btn-sm btn-auracook-primary" onClick={() => dispatch(cookingStarted(recipe.id))}>
            <Flame size={14} className="me-1" /> Cook Now
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 4.6  `src/components/RecipeDetailModal.jsx`

*reads pantry + dispatch*

```jsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cookingStarted } from '../store/uiSlice';
import { selectPantryItems } from '../store/selectors';
import { X, ShoppingBag, Check, Flame } from 'lucide-react';

export const RecipeDetailModal = ({ recipe, onClose }) => {
  const dispatch = useAppDispatch();
  const pantry = useAppSelector(selectPantryItems);

  if (!recipe) return null;

  const pantryNames = pantry.filter(i => i.status !== 'Out of Stock').map(i => i.name.toLowerCase());

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content glass-panel border-0 overflow-hidden">
          <div className="modal-header border-0 bg-sage-dark text-white p-4 d-flex justify-content-between align-items-center">
            <h4 className="modal-title font-serif text-white">{recipe.title}</h4>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-5">
                <img
                  src={recipe.image}
                  className="img-fluid rounded-4 shadow-sm mb-3"
                  alt={recipe.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-sage">{recipe.category}</span>
                  <span className="badge bg-terracotta">{recipe.difficulty}</span>
                  <span className="badge bg-secondary">{recipe.servings} Servings</span>
                </div>
                <p className="text-muted small">{recipe.description}</p>
              </div>

              <div className="col-md-7">
                <h5 className="font-serif border-bottom pb-2 mb-3 d-flex align-items-center">
                  <ShoppingBag size={18} className="me-2 text-terracotta" /> Required Ingredients
                </h5>
                <ul className="list-group list-group-flush mb-4">
                  {recipe.ingredients.map((ing, idx) => {
                    const inPantry = pantryNames.some(p => p.includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(p));
                    return (
                      <li key={idx} className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                        <span>{ing.amount} {ing.unit} <strong>{ing.name}</strong></span>
                        {inPantry ? (
                          <span className="badge bg-success-subtle text-success"><Check size={12} className="me-1" />In Stock</span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger"><X size={12} className="me-1" />Missing</span>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <h5 className="font-serif border-bottom pb-2 mb-3">Instructions Overview</h5>
                <ol className="ps-3 text-muted small">
                  {recipe.instructions.map((inst, idx) => (
                    <li key={idx} className="mb-2">{inst.text}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 p-4 pt-0">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button
              type="button"
              className="btn btn-auracook-primary"
              onClick={() => {
                onClose();
                dispatch(cookingStarted(recipe.id));
              }}
            >
              <Flame size={16} className="me-1" /> Start Cooking Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 4.7  `src/components/MultiTimerDrawer.jsx`

*dispatch timer + drawer actions*

```jsx
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { drawerClosed } from '../store/uiSlice';
import { timerAdded, timerRemoved, timerReset, timerToggled } from '../store/timerSlice';
import { selectIsTimerDrawerOpen, selectTimers } from '../store/selectors';
import { Timer, Plus, Play, Pause, RotateCcw, Trash2 } from 'lucide-react';

export const MultiTimerDrawer = () => {
  const dispatch = useAppDispatch();
  const timers = useAppSelector(selectTimers);
  const isTimerDrawerOpen = useAppSelector(selectIsTimerDrawerOpen);

  const [customName, setCustomName] = useState('');
  const [customMins, setCustomMins] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTimer = (e) => {
    e.preventDefault();
    const mins = parseInt(customMins, 10);
    if (isNaN(mins) || mins <= 0) return;
    dispatch(timerAdded({ name: customName, durationSeconds: mins * 60 }));
    setCustomName('');
    setCustomMins('');
    setShowAddForm(false);
  };

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div
        className={`timer-drawer-overlay ${isTimerDrawerOpen ? 'active' : ''}`}
        onClick={() => dispatch(drawerClosed())}
      />

      <div className={`timer-drawer ${isTimerDrawerOpen ? 'active' : ''}`}>
        <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
          <h4 className="font-serif mb-0 d-flex align-items-center">
            <Timer className="text-terracotta me-2" size={24} /> Kitchen Timers
          </h4>
          <button
            className="btn-close"
            onClick={() => dispatch(drawerClosed())}
          />
        </div>

        <div className="mb-3">
          {!showAddForm ? (
            <button
              className="btn btn-auracook-primary w-100 d-flex align-items-center justify-content-center"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} className="me-1" /> Add Custom Timer
            </button>
          ) : (
            <form onSubmit={handleAddTimer} className="glass-panel p-3">
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Timer Name (e.g. Pasta)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Duration (Minutes)"
                  value={customMins}
                  onChange={(e) => setCustomMins(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-auracook-primary btn-sm flex-grow-1">Start</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2">
          <button className="btn btn-sm btn-outline-secondary text-nowrap" onClick={() => dispatch(timerAdded({ name: 'Pasta Boiling', durationSeconds: 8 * 60 }))}>8m Pasta</button>
          <button className="btn btn-sm btn-outline-secondary text-nowrap" onClick={() => dispatch(timerAdded({ name: 'Sauce Simmer', durationSeconds: 12 * 60 }))}>12m Sauce</button>
          <button className="btn btn-sm btn-outline-secondary text-nowrap" onClick={() => dispatch(timerAdded({ name: 'Oven Roast', durationSeconds: 20 * 60 }))}>20m Oven</button>
        </div>

        <div className="flex-grow-1 overflow-y-auto">
          {timers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <Timer size={48} className="text-terracotta opacity-50 mb-3" />
              <p>No active timers running.</p>
            </div>
          ) : (
            timers.map(t => {
              const pct = Math.round((t.remainingSeconds / t.totalSeconds) * 100);
              return (
                <div key={t.id} className={`timer-card ${t.status === 'finished' ? 'finished' : ''}`}>
                  <div>
                    <div className="fw-bold text-dark mb-1">{t.name}</div>
                    <div className="timer-display-time">{formatTime(t.remainingSeconds)}</div>
                  </div>
                  <div className="d-flex gap-2">
                    {t.status !== 'finished' && (
                      <button className="btn btn-sm btn-light shadow-sm" onClick={() => dispatch(timerToggled(t.id))}>
                        {t.status === 'running' ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    )}
                    <button className="btn btn-sm btn-light shadow-sm" onClick={() => dispatch(timerReset(t.id))}>
                      <RotateCcw size={16} />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(timerRemoved(t.id))}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="timer-progress-bg" style={{ width: `${pct}%` }}></div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
```

### 4.8  `src/pages/HomePage.jsx`

*dispatch(pageChanged) / dispatch(drawerOpened)*

```jsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { drawerOpened, pageChanged } from '../store/uiSlice';
import { selectRecipes } from '../store/selectors';
import { RecipeCard } from '../components/RecipeCard';
import { Sparkles, Compass, Play, Warehouse, Timer, Flame, ShoppingBag, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector(selectRecipes);

  return (
    <div className="container">
      <section className="hero-auracook">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="hero-tag">
              <Sparkles size={16} /> Smart Cooking Experience
            </div>
            <h1 className="display-4 mb-3">Cook in Harmony with Your Senses</h1>
            <p className="lead mb-4 text-white-50">
              Welcome to AuraCook – your ambient kitchen companion. Experience step-by-step interactive recipe guidance, multiple simultaneous timers, and intelligent pantry recommendations.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button className="btn btn-auracook-primary btn-lg" onClick={() => dispatch(pageChanged('recipes'))}>
                <Compass size={18} className="me-2" /> Discover Recipes
              </button>
              <button className="btn btn-auracook-secondary btn-lg bg-white text-dark" onClick={() => dispatch(pageChanged('cooking'))}>
                <Play size={18} className="me-2" /> Start Cooking Mode
              </button>
              <button className="btn btn-outline-light btn-lg" onClick={() => dispatch(pageChanged('pantry'))}>
                <Warehouse size={18} className="me-2" /> Digital Pantry
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="glass-card p-4 h-100 d-flex flex-column">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="vibe-icon-wrapper">
                <Timer size={20} color="white" />
              </div>
              <div>
                <h5 className="mb-0 font-serif">Multi-Timer Control</h5>
                <small className="text-muted">Manage all cooking steps</small>
              </div>
            </div>
            <p className="text-muted small flex-grow-1">
              Set and monitor multiple simultaneous countdown timers for boiling, searing, and oven baking.
            </p>
            <button className="btn btn-sm btn-auracook-secondary mt-auto" onClick={() => dispatch(drawerOpened())}>
              Open Timer Drawer
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 h-100 d-flex flex-column">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="vibe-icon-wrapper" style={{ background: 'linear-gradient(135deg, var(--c-sage), var(--c-sage-dark))' }}>
                <Flame size={20} color="white" />
              </div>
              <div>
                <h5 className="mb-0 font-serif">Guided Cooking Mode</h5>
                <small className="text-muted">Step-by-step clarity</small>
              </div>
            </div>
            <p className="text-muted small flex-grow-1">
              Follow clean, structured step instructions with tools, ingredients, and built-in timer integration.
            </p>
            <button className="btn btn-sm btn-auracook-secondary mt-auto" onClick={() => dispatch(pageChanged('cooking'))}>
              Start Cooking Mode
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 h-100 d-flex flex-column">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="vibe-icon-wrapper" style={{ background: 'linear-gradient(135deg, var(--c-amber), #E5A84B)' }}>
                <ShoppingBag size={20} color="white" />
              </div>
              <div>
                <h5 className="mb-0 font-serif">Smart Pantry Match</h5>
                <small className="text-muted">Zero food waste recommendations</small>
              </div>
            </div>
            <p className="text-muted small flex-grow-1">
              Track ingredients in stock and instantly filter recipes you can prepare right now with available pantry items.
            </p>
            <button className="btn btn-sm btn-auracook-secondary mt-auto" onClick={() => dispatch(pageChanged('pantry'))}>
              View My Stock
            </button>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <span className="text-terracotta fw-bold text-uppercase small">Pantry Powered</span>
            <h2 className="h3 font-serif mb-0">What Can You Cook Today?</h2>
          </div>
          <button className="btn btn-link text-terracotta fw-bold text-decoration-none" onClick={() => dispatch(pageChanged('recipes'))}>
            View All Library <ArrowRight size={16} className="ms-1" />
          </button>
        </div>

        <div className="row g-4">
          {recipes.slice(0, 3).map(recipe => (
            <div key={recipe.id} className="col-md-4">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
```

### 4.9  `src/pages/RecipesPage.jsx`

*useMemo filtering over store data*

```jsx
import React, { useMemo, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectPantryItems, selectRecipes } from '../store/selectors';
import { computeRecipeMatch } from '../utils/match';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeDetailModal } from '../components/RecipeDetailModal';
import { Search, RotateCcw, UtensilsCrossed, ShoppingBag } from 'lucide-react';

export const RecipesPage = () => {
  const recipes = useAppSelector(selectRecipes);
  const pantry = useAppSelector(selectPantryItems);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [onlyPantryMatch, setOnlyPantryMatch] = useState(false);
  const [selectedRecipeModal, setSelectedRecipeModal] = useState(null);

  const filteredRecipes = useMemo(() => {
    const query = search.toLowerCase();

    return recipes.filter(recipe => {
      const matchSearch = recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(i => i.name.toLowerCase().includes(query));
      const matchCategory = category === 'all' || recipe.category === category;
      const matchDifficulty = difficulty === 'all' || recipe.difficulty === difficulty;
      const matchPantry = !onlyPantryMatch || computeRecipeMatch(recipe, pantry).percent >= 70;

      return matchSearch && matchCategory && matchDifficulty && matchPantry;
    });
  }, [recipes, pantry, search, category, difficulty, onlyPantryMatch]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setDifficulty('all');
    setOnlyPantryMatch(false);
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
        <div>
          <h1 className="h2 font-serif mb-1">Recipe Library</h1>
          <p className="text-muted mb-0">Explore curated recipes paired with intelligent pantry stock matching.</p>
        </div>

        <div className="mt-3 mt-md-0">
          <div className="form-check form-switch p-2 glass-panel ps-5 pe-3 d-inline-flex align-items-center">
            <input
              className="form-check-input me-2"
              type="checkbox"
              id="filter-pantry-match"
              checked={onlyPantryMatch}
              onChange={(e) => setOnlyPantryMatch(e.target.checked)}
            />
            <label className="form-check-input-label fw-bold text-sage small mb-0" htmlFor="filter-pantry-match">
              <ShoppingBag size={14} className="me-1 text-terracotta" /> Show Only "Can Make Now"
            </label>
          </div>
        </div>
      </div>

      <div className="glass-panel p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-lg-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><Search size={16} className="text-muted" /></span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search recipe or ingredient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4 col-lg-3">
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="Main Course">Main Course</option>
              <option value="Quick & Easy">Quick & Easy</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Seafood">Seafood</option>
            </select>
          </div>

          <div className="col-md-4 col-lg-3">
            <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="col-md-4 col-lg-2 text-end">
            <button className="btn btn-outline-secondary w-100" onClick={handleResetFilters}>
              <RotateCcw size={14} className="me-1" /> Reset
            </button>
          </div>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-5">
          <UtensilsCrossed size={48} className="text-muted mb-3" />
          <h3>No Recipes Found</h3>
          <p className="text-muted">Try adjusting your search terms or unchecking the "Can Make Now" filter.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="col-md-6 col-lg-4">
              <RecipeCard recipe={recipe} onOpenModal={(r) => setSelectedRecipeModal(r)} />
            </div>
          ))}
        </div>
      )}

      {selectedRecipeModal && (
        <RecipeDetailModal
          recipe={selectedRecipeModal}
          onClose={() => setSelectedRecipeModal(null)}
        />
      )}
    </div>
  );
};
```

### 4.10  `src/pages/CookingPage.jsx`

*dispatch(timerAdded) instead of createTimer*

```jsx
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { pageChanged } from '../store/uiSlice';
import { timerAdded } from '../store/timerSlice';
import { selectActiveRecipeId, selectPantryItems, selectRecipes } from '../store/selectors';
import { Flame, Timer, Wrench, Leaf, ArrowLeft, ArrowRight, CheckCircle, Check, X } from 'lucide-react';

export const CookingPage = () => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector(selectRecipes);
  const activeRecipeId = useAppSelector(selectActiveRecipeId);
  const pantry = useAppSelector(selectPantryItems);

  const currentRecipe = recipes.find(r => r.id === activeRecipeId) || recipes[0];
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const step = currentRecipe.instructions[currentStepIdx];
  const totalSteps = currentRecipe.instructions.length;
  const progressPct = Math.round(((currentStepIdx + 1) / totalSteps) * 100);

  const inStockNames = pantry
    .filter(i => i.status !== 'Out of Stock')
    .map(i => i.name.toLowerCase());

  const handleStepNavigation = (dir) => {
    if (dir === 1 && currentStepIdx === totalSteps - 1) {
      setShowCompletionModal(true);
      return;
    }
    setCurrentStepIdx(prev => {
      const next = prev + dir;
      if (next < 0) return 0;
      if (next >= totalSteps) return totalSteps - 1;
      return next;
    });
  };

  return (
    <div className="cooking-container container px-3 py-4">
      <div className="cooking-hero-card d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <span className="badge bg-terracotta text-white mb-2"><Flame size={12} className="me-1" /> Cooking In Progress</span>
          <h1 className="h2 font-serif text-white mb-1">{currentRecipe.title}</h1>
          <p className="text-white-50 mb-0 small">
            Prep: {currentRecipe.prepTime}m | Cook: {currentRecipe.cookTime}m | Servings: {currentRecipe.servings}
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 bg-white-10 p-2 rounded-3">
          <span className="text-white-50 small">Jump to step:</span>
          <select
            className="form-select form-select-sm bg-dark text-white border-secondary"
            value={currentStepIdx}
            onChange={(e) => setCurrentStepIdx(parseInt(e.target.value, 10))}
          >
            {currentRecipe.instructions.map((inst, i) => (
              <option key={i} value={i}>Step {inst.step}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="progress mb-4" style={{ height: '8px', borderRadius: '4px' }}>
        <div className="progress-bar bg-terracotta" style={{ width: `${progressPct}%` }}></div>
      </div>

      <div className="cooking-step-card">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-3">
              <div className="step-number-badge">{step.step}</div>
              <span className="text-muted fw-bold text-uppercase">Step {step.step} of {totalSteps}</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              {step.timerMinutes > 0 && (
                <button
                  className="btn btn-auracook-primary btn-sm"
                  onClick={() => dispatch(timerAdded({ name: `Step ${step.step} Timer`, durationSeconds: step.timerMinutes * 60 }))}
                >
                  <Timer size={14} className="me-1" /> Start {step.timerMinutes}m Timer
                </button>
              )}
            </div>
          </div>

          <div className="step-instruction-text">
            {step.text}
          </div>
        </div>

        <div>
          <div className="row g-3 border-top pt-3 mb-3">
            <div className="col-md-6">
              <small className="text-muted fw-bold text-uppercase d-block mb-2">
                <Wrench size={14} className="me-1 text-terracotta" /> Tools Needed:
              </small>
              <div className="step-tools-list">
                {step.tools && step.tools.length > 0 ? (
                  step.tools.map((t, idx) => (
                    <span key={idx} className="step-tool-tag">{t}</span>
                  ))
                ) : (
                  <span className="text-muted small">None specified</span>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <small className="text-muted fw-bold text-uppercase d-block mb-2">
                <Leaf size={14} className="me-1 text-terracotta" /> Step Ingredients:
              </small>
              <div className="step-tools-list">
                {step.ingredients && step.ingredients.length > 0 ? (
                  step.ingredients.map((ing, idx) => {
                    const hasItem = inStockNames.some(p => p.includes(ing.toLowerCase()) || ing.toLowerCase().includes(p));
                    return (
                      <span
                        key={idx}
                        className={`step-tool-tag ${hasItem ? 'bg-dark text-white fw-bold border-0 shadow-sm' : 'bg-light text-muted border border-secondary-subtle'}`}
                      >
                        {hasItem ? <Check size={12} className="me-1 text-success" /> : <X size={12} className="me-1 text-danger opacity-75" />}
                        {ing}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-muted small">None specified</span>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between pt-2">
            <button
              className="btn btn-auracook-secondary btn-lg"
              disabled={currentStepIdx === 0}
              onClick={() => handleStepNavigation(-1)}
            >
              <ArrowLeft size={18} className="me-2" /> Previous Step
            </button>

            <button
              className={`btn btn-lg ${currentStepIdx === totalSteps - 1 ? 'btn-success' : 'btn-auracook-primary'}`}
              onClick={() => handleStepNavigation(1)}
            >
              {currentStepIdx === totalSteps - 1 ? (
                <>Complete Recipe <CheckCircle size={18} className="ms-2" /></>
              ) : (
                <>Next Step <ArrowRight size={18} className="ms-2" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {showCompletionModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered text-center">
            <div className="modal-content glass-panel p-4 border-0">
              <div className="mb-3">
                <CheckCircle size={64} className="text-terracotta mb-3" />
                <h2 className="font-serif">Bon Appétit! 🎉</h2>
                <p className="text-muted">You have successfully completed this recipe!</p>
              </div>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-auracook-primary" onClick={() => { setShowCompletionModal(false); dispatch(pageChanged('recipes')); }}>
                  Explore More Recipes
                </button>
                <button className="btn btn-outline-secondary" onClick={() => { setShowCompletionModal(false); dispatch(pageChanged('home')); }}>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### 4.11  `src/pages/PantryPage.jsx`

*dispatch(itemAdded/itemUpdated/itemDeleted/staplesRestored)*

```jsx
import React, { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cookingStarted } from '../store/uiSlice';
import { itemAdded, itemDeleted, itemUpdated, staplesRestored } from '../store/pantrySlice';
import { makeSelectRankedRecipes, selectPantryItems } from '../store/selectors';
import { Search, Plus, Sparkles, Edit, Trash2, ChefHat } from 'lucide-react';

const COMMON_INGREDIENTS = [
  { name: "Garlic", category: "Produce", unit: "cloves" },
  { name: "Olive Oil", category: "Pantry Staples", unit: "ml" },
  { name: "Heavy Cream", category: "Dairy & Eggs", unit: "ml" },
  { name: "Chicken Breast", category: "Meat & Seafood", unit: "pieces" },
  { name: "Fresh Spinach", category: "Produce", unit: "bunch" },
  { name: "Parmesan Cheese", category: "Dairy & Eggs", unit: "g" },
  { name: "Mushrooms", category: "Produce", unit: "g" },
  { name: "Fettuccine Pasta", category: "Grains & Bakery", unit: "g" },
  { name: "Crushed Tomatoes", category: "Pantry Staples", unit: "cans" },
  { name: "Salt", category: "Spices & Herbs", unit: "container" },
  { name: "Black Pepper", category: "Spices & Herbs", unit: "container" },
  { name: "Quinoa", category: "Grains & Bakery", unit: "cup" },
  { name: "Chickpeas", category: "Pantry Staples", unit: "can" },
  { name: "Cucumber", category: "Produce", unit: "medium" },
  { name: "Cherry Tomatoes", category: "Produce", unit: "cup" },
  { name: "Feta Cheese", category: "Dairy & Eggs", unit: "cup" },
  { name: "Lemon", category: "Produce", unit: "whole" },
  { name: "Salmon Fillet", category: "Meat & Seafood", unit: "pieces" },
  { name: "Honey", category: "Pantry Staples", unit: "tbsp" },
  { name: "Soy Sauce", category: "Pantry Staples", unit: "tbsp" },
  { name: "Butter", category: "Dairy & Eggs", unit: "tbsp" },
  { name: "Asparagus", category: "Produce", unit: "bunch" },
  { name: "Sun-dried Tomatoes", category: "Pantry Staples", unit: "cup" },
  { name: "Fresh Basil", category: "Produce", unit: "cup" },
  { name: "Onions", category: "Produce", unit: "pieces" },
  { name: "Potatoes", category: "Produce", unit: "g" },
  { name: "Eggs", category: "Dairy & Eggs", unit: "dozen" },
  { name: "Milk", category: "Dairy & Eggs", unit: "liters" },
  { name: "Flour", category: "Grains & Bakery", unit: "kg" },
  { name: "Sugar", category: "Pantry Staples", unit: "kg" },
  { name: "Rice", category: "Grains & Bakery", unit: "kg" }
];

export const PantryPage = () => {
  const dispatch = useAppDispatch();
  const pantry = useAppSelector(selectPantryItems);
  const selectRankedRecipes = useMemo(() => makeSelectRankedRecipes(), []);
  const recipeMatches = useAppSelector(selectRankedRecipes);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [formName, setFormName] = useState('');
  const [formQty, setFormQty] = useState(1);
  const [formUnit, setFormUnit] = useState('');
  const [formCat, setFormCat] = useState('Produce');
  const [formExpiry, setFormExpiry] = useState('');
  const [formStatus, setFormStatus] = useState('In Stock');

  const openAddModal = () => {
    setEditItem(null);
    setFormName(COMMON_INGREDIENTS[0].name);
    setFormQty(1);
    setFormUnit(COMMON_INGREDIENTS[0].unit);
    setFormCat(COMMON_INGREDIENTS[0].category);
    setFormExpiry('');
    setFormStatus('In Stock');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setFormName(item.name);
    setFormQty(item.quantity);
    setFormUnit(item.unit || '');
    setFormCat(item.category);
    setFormExpiry(item.expiryDate || '');
    setFormStatus(item.status);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const sanitizedQty = Math.max(0, parseFloat(formQty) || 0);
    const finalStatus = sanitizedQty === 0 ? "Out of Stock" : formStatus;

    const fields = {
      name: formName.trim(),
      quantity: sanitizedQty,
      unit: formUnit.trim(),
      category: formCat,
      expiryDate: formExpiry,
      status: finalStatus
    };

    if (editItem) {
      dispatch(itemUpdated({ id: editItem.id, fields }));
    } else {
      dispatch(itemAdded(fields));
    }
    setShowModal(false);
  };

  const filteredPantry = pantry.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || item.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h1 className="h2 font-serif mb-1">Digital Pantry Inventory</h1>
          <p className="text-muted mb-0">Track kitchen stock, monitor expiry dates, and unlock recipe recommendations.</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-secondary" onClick={() => dispatch(staplesRestored())}>
            <Sparkles size={16} className="me-1" /> Populate Common Staples
          </button>
          <button className="btn btn-auracook-primary" onClick={openAddModal}>
            <Plus size={16} className="me-1" /> Add Ingredient
          </button>
        </div>
      </div>

      <div className="glass-panel p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><Search size={16} className="text-muted" /></span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search pantry items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="Produce">Produce</option>
              <option value="Dairy & Eggs">Dairy & Eggs</option>
              <option value="Pantry Staples">Pantry Staples</option>
              <option value="Spices & Herbs">Spices & Herbs</option>
              <option value="Meat & Seafood">Meat & Seafood</option>
              <option value="Grains & Bakery">Grains & Bakery</option>
            </select>
          </div>

          <div className="col-md-12 col-lg-3 text-end">
            <span className="text-muted small me-2">Total Items: <strong>{filteredPantry.length}</strong></span>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-8">
          <div className="glass-panel p-3">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Quantity</th>
                    <th>Category</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPantry.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">No pantry items found.</td>
                    </tr>
                  ) : (
                    filteredPantry.map(item => {
                      let statusBadge = "status-in-stock";
                      if (item.status === "Low Stock") statusBadge = "status-low-stock";
                      if (item.status === "Out of Stock") statusBadge = "status-out-stock";

                      return (
                        <tr key={item.id}>
                          <td className="fw-bold">{item.name}</td>
                          <td>{item.quantity} {item.unit || ''}</td>
                          <td><span className="badge bg-secondary-subtle text-dark">{item.category}</span></td>
                          <td className="small text-muted">{item.expiryDate || 'N/A'}</td>
                          <td><span className={`pantry-status-badge ${statusBadge}`}>{item.status}</span></td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEditModal(item)}>
                              <Edit size={14} />
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(itemDeleted({ id: item.id, name: item.name }))}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card p-4">
            <h5 className="font-serif mb-3 border-bottom pb-2 d-flex align-items-center">
              <ChefHat size={20} className="text-terracotta me-2" /> Pantry Recommendations
            </h5>
            <p className="text-muted small">Recipes you can cook with your available ingredients:</p>
            {recipeMatches.map(({ recipe, match }) => (
              <div key={recipe.id} className="d-flex align-items-center justify-content-between p-2 mb-2 rounded border bg-white">
                <div>
                  <div className="fw-bold small">{recipe.title}</div>
                  <small className="text-muted">{match.matched}/{match.total} ingredients</small>
                </div>
                <div className="text-end">
                  <span className={`badge ${match.percent >= 70 ? 'bg-success' : 'bg-warning text-dark'} mb-1 d-block`}>
                    {match.percent}%
                  </span>
                  <button
                    className="btn btn-auracook-primary py-0 px-2 text-white"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => dispatch(cookingStarted(recipe.id))}
                  >
                    Cook
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-panel border-0">
              <div className="modal-header border-0 bg-sage text-white p-4 d-flex justify-content-between align-items-center">
                <h5 className="modal-title font-serif text-white">{editItem ? 'Edit Ingredient' : 'Add New Ingredient'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label font-sans fw-bold small">Ingredient Name</label>
                    <select
                      className="form-select"
                      required
                      value={formName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormName(val);
                        const match = COMMON_INGREDIENTS.find(i => i.name === val);
                        if (match) {
                          if (match.category) setFormCat(match.category);
                          if (match.unit) setFormUnit(match.unit);
                        }
                      }}
                    >
                      <option value="" disabled>-- Select Ingredient --</option>
                      {COMMON_INGREDIENTS.map((item, idx) => (
                        <option key={idx} value={item.name}>
                          {item.name} ({item.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label font-sans fw-bold small">Quantity</label>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        className="form-control"
                        required
                        value={formQty}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setFormQty(isNaN(val) ? '' : Math.max(0, val));
                        }}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label font-sans fw-bold small">Unit</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="cloves, g, ml"
                        value={formUnit}
                        onChange={(e) => setFormUnit(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label font-sans fw-bold small">Category</label>
                      <select className="form-select" value={formCat} onChange={(e) => setFormCat(e.target.value)}>
                        <option value="Produce">Produce</option>
                        <option value="Dairy & Eggs">Dairy & Eggs</option>
                        <option value="Pantry Staples">Pantry Staples</option>
                        <option value="Spices & Herbs">Spices & Herbs</option>
                        <option value="Meat & Seafood">Meat & Seafood</option>
                        <option value="Grains & Bakery">Grains & Bakery</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label font-sans fw-bold small">Expiry Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formExpiry}
                        onChange={(e) => setFormExpiry(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label font-sans fw-bold small">Stock Status</label>
                    <select className="form-select" value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-auracook-primary">Save Ingredient</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## Step 5 - run and verify

```bash
npm run dev
```

Open <http://localhost:3000> and check all six:

1. **Home** shows the hero, 3 feature cards and 3 recipe cards - each with a **% Pantry Match** badge
2. **Recipes** - typing filters instantly, and the "Can Make Now" toggle works
3. **Details** opens the modal with green **In Stock** / red **Missing** badges per ingredient
4. **Start Cooking Mode** → **Start 6m Timer** → the navbar **Timers** badge changes to `1`
5. **Timers** opens the drawer, the countdown runs, pause / reset / delete all work
6. **Pantry** → set an item's quantity to `0` → Save → status becomes **Out of Stock** and the percentages drop.
   Refresh the page (`Cmd+R`) - the change is still there, so localStorage worked.

If a page is blank: `F12` in the browser, **Console** tab, read the **first** red line. Almost always a typo
from pasting, or a file saved into the wrong folder.

### Before the viva

```bash
npm run build      # must end with a line like: built in 2.6s
npm run deploy     # pushes dist/ to the gh-pages branch
```

Wait a minute, then hard-refresh the live site with `Cmd+Shift+R`.

---

## What you just built - the viva answer

> "State lives in one Redux store with three slices: `pantry`, `timers` and `ui`.
> Components read through `useSelector`, so each subscribes only to the value it needs - which is why a
> timer tick no longer re-renders the pantry table, the flaw our earlier Context version had.
> Changes go through `dispatch`; reducers are pure, Immer provides the immutability, and `prepare`
> callbacks generate the ids so nothing random happens inside a reducer. Side effects - the timer bell,
> the toast auto-dismiss, the localStorage write - live in listener middleware and a store subscription.
> Derived data such as the pantry-match percentage comes from memoised `createSelector` selectors, so it
> is never stored and can never go stale."

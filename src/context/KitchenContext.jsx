import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_RECIPES } from '../data/recipes';
import { DEFAULT_PANTRY } from '../data/defaultPantry';

const KitchenContext = createContext();

export const KitchenProvider = ({ children }) => {
  const [recipes] = useState(DEFAULT_RECIPES);
  
  const [pantry, setPantry] = useState(() => {
    const saved = localStorage.getItem('auracook_pantry_react');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_PANTRY;
  });

  useEffect(() => {
    localStorage.setItem('auracook_pantry_react', JSON.stringify(pantry));
  }, [pantry]);

  const [timers, setTimers] = useState([]);
  const [isTimerDrawerOpen, setIsTimerDrawerOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState('home');
  const [activeRecipeId, setActiveRecipeId] = useState(DEFAULT_RECIPES[0].id);

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const playTimerBell = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
    } catch (e) {}
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        return prevTimers.map(timer => {
          if (timer.status === 'running') {
            const nextRemaining = timer.remainingSeconds - 1;
            if (nextRemaining <= 0) {
              playTimerBell();
              addToast(`⏰ Timer Alert! "${timer.name}" completed!`, 'warning');
              return { ...timer, remainingSeconds: 0, status: 'finished' };
            }
            return { ...timer, remainingSeconds: nextRemaining };
          }
          return timer;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const createTimer = (name, durationSeconds) => {
    const newTimer = {
      id: 'timer_' + Date.now(),
      name: name || 'Kitchen Timer',
      totalSeconds: durationSeconds,
      remainingSeconds: durationSeconds,
      status: 'running'
    };
    setTimers(prev => [...prev, newTimer]);
    addToast(`Timer "${newTimer.name}" started!`, 'success');
  };

  const toggleTimerPause = (id) => {
    setTimers(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'running' ? 'paused' : (t.remainingSeconds > 0 ? 'running' : 'finished');
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const resetTimer = (id) => {
    setTimers(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, remainingSeconds: t.totalSeconds, status: 'paused' };
      }
      return t;
    }));
  };

  const deleteTimer = (id) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const addPantryItem = (item) => {
    const qty = Math.max(0, parseFloat(item.quantity) || 0);
    const status = qty === 0 ? "Out of Stock" : (item.status || "In Stock");
    const newItem = { ...item, quantity: qty, status, id: 'p_' + Date.now() };
    setPantry(prev => [...prev, newItem]);
    addToast(`Added "${newItem.name}" to pantry`, 'success');
  };

  const updatePantryItem = (id, updatedFields) => {
    setPantry(prev => prev.map(i => {
      if (i.id === id) {
        const merged = { ...i, ...updatedFields };
        const qty = Math.max(0, parseFloat(merged.quantity) || 0);
        const status = qty === 0 ? "Out of Stock" : merged.status;
        return { ...merged, quantity: qty, status };
      }
      return i;
    }));
    addToast(`Updated pantry item`, 'info');
  };

  const deletePantryItem = (id) => {
    const item = pantry.find(i => i.id === id);
    setPantry(prev => prev.filter(i => i.id !== id));
    if (item) addToast(`Removed "${item.name}" from pantry`, 'info');
  };

  const resetPantryToStaples = () => {
    setPantry(DEFAULT_PANTRY);
    addToast(`Restored common kitchen staples to pantry`, 'success');
  };

  const computeRecipeMatch = (recipe) => {
    const inStockNames = pantry
      .filter(i => i.status !== 'Out of Stock')
      .map(i => i.name.toLowerCase());

    let matched = 0;
    const missing = [];

    recipe.ingredients.forEach(ing => {
      const isAvailable = inStockNames.some(p => p.includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(p));
      if (isAvailable) {
        matched++;
      } else {
        missing.push(ing.name);
      }
    });

    const percent = Math.round((matched / recipe.ingredients.length) * 100);
    return { matched, total: recipe.ingredients.length, percent, missing };
  };

  const navigateToCooking = (recipeId) => {
    setActiveRecipeId(recipeId);
    setCurrentPage('cooking');
  };

  return (
    <KitchenContext.Provider value={{
      recipes,
      pantry,
      timers,
      isTimerDrawerOpen,
      setIsTimerDrawerOpen,
      currentPage,
      setCurrentPage,
      activeRecipeId,
      toasts,
      addToast,
      createTimer,
      toggleTimerPause,
      resetTimer,
      deleteTimer,
      addPantryItem,
      updatePantryItem,
      deletePantryItem,
      resetPantryToStaples,
      computeRecipeMatch,
      navigateToCooking
    }}>
      {children}
    </KitchenContext.Provider>
  );
};

export const useKitchen = () => useContext(KitchenContext);

import React from 'react';
import { KitchenProvider, useKitchen } from './context/KitchenContext';
import { Navbar } from './components/Navbar';
import { VibeDock } from './components/VibeDock';
import { MultiTimerDrawer } from './components/MultiTimerDrawer';
import { ToastContainer } from './components/ToastContainer';
import { HomePage } from './pages/HomePage';
import { RecipesPage } from './pages/RecipesPage';
import { CookingPage } from './pages/CookingPage';
import { PantryPage } from './pages/PantryPage';

const AppContent = () => {
  const { currentPage } = useKitchen();

  return (
    <div className="app-layout">
      <Navbar />
      
      <main className="py-3">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'recipes' && <RecipesPage />}
        {currentPage === 'cooking' && <CookingPage />}
        {currentPage === 'pantry' && <PantryPage />}
      </main>

      <MultiTimerDrawer />
      <VibeDock />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <KitchenProvider>
      <AppContent />
    </KitchenProvider>
  );
}

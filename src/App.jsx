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

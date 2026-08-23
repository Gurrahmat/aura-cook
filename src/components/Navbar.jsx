import React from 'react';
import { useKitchen } from '../context/KitchenContext';
import { Utensils, Home, BookOpen, Flame, Box, Timer } from 'lucide-react';

export const Navbar = () => {
  const { currentPage, setCurrentPage, timers, setIsTimerDrawerOpen } = useKitchen();

  return (
    <nav className="navbar navbar-expand-lg navbar-auracook">
      <div className="container-fluid">
        <a 
          className="navbar-brand-auracook" 
          href="#" 
          onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
        >
          <Utensils className="me-2" /> AuraCook
        </a>

        <div className="collapse navbar-collapse show" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item">
              <a 
                className={`nav-link-auracook ${currentPage === 'home' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
              >
                <Home size={18} /> Home
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link-auracook ${currentPage === 'recipes' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage('recipes'); }}
              >
                <BookOpen size={18} /> Recipes
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link-auracook ${currentPage === 'cooking' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage('cooking'); }}
              >
                <Flame size={18} /> Cooking Mode
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link-auracook ${currentPage === 'pantry' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage('pantry'); }}
              >
                <Box size={18} /> Pantry
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-auracook-secondary btn-toggle-timer position-relative"
              onClick={() => setIsTimerDrawerOpen(true)}
            >
              <Timer size={18} className="me-1" /> Timers
              <span className="badge-timer-count ms-2">{timers.length}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};


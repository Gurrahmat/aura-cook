import React from 'react';
import { useKitchen } from '../context/KitchenContext';
import { RecipeCard } from '../components/RecipeCard';
import { Sparkles, Compass, Play, Warehouse, Timer, Flame, ShoppingBag, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const { recipes, setCurrentPage, setIsTimerDrawerOpen } = useKitchen();

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
              <button className="btn btn-auracook-primary btn-lg" onClick={() => setCurrentPage('recipes')}>
                <Compass size={18} className="me-2" /> Discover Recipes
              </button>
              <button className="btn btn-auracook-secondary btn-lg bg-white text-dark" onClick={() => setCurrentPage('cooking')}>
                <Play size={18} className="me-2" /> Start Cooking Mode
              </button>
              <button className="btn btn-outline-light btn-lg" onClick={() => setCurrentPage('pantry')}>
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
            <button className="btn btn-sm btn-auracook-secondary mt-auto" onClick={() => setIsTimerDrawerOpen(true)}>
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
            <button className="btn btn-sm btn-auracook-secondary mt-auto" onClick={() => setCurrentPage('cooking')}>
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
            <button className="btn btn-sm btn-auracook-secondary mt-auto" onClick={() => setCurrentPage('pantry')}>
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
          <button className="btn btn-link text-terracotta fw-bold text-decoration-none" onClick={() => setCurrentPage('recipes')}>
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

import React, { useState } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeDetailModal } from '../components/RecipeDetailModal';
import { Search, RotateCcw, UtensilsCrossed, ShoppingBag } from 'lucide-react';

export const RecipesPage = () => {
  const { recipes, computeRecipeMatch } = useKitchen();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [onlyPantryMatch, setOnlyPantryMatch] = useState(false);
  const [selectedRecipeModal, setSelectedRecipeModal] = useState(null);

  const filteredRecipes = recipes.filter(recipe => {
    const matchSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) ||
                        recipe.description.toLowerCase().includes(search.toLowerCase()) ||
                        recipe.ingredients.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = category === 'all' || recipe.category === category;
    const matchDifficulty = difficulty === 'all' || recipe.difficulty === difficulty;

    const matchInfo = computeRecipeMatch(recipe);
    const matchPantry = !onlyPantryMatch || matchInfo.percent >= 70;

    return matchSearch && matchCategory && matchDifficulty && matchPantry;
  });

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

import React from 'react';
import { useKitchen } from '../context/KitchenContext';
import { Clock, Signal, Flame, Eye } from 'lucide-react';

export const RecipeCard = ({ recipe, onOpenModal }) => {
  const { computeRecipeMatch, navigateToCooking } = useKitchen();
  const match = computeRecipeMatch(recipe);

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

          <button className="btn btn-sm btn-auracook-primary" onClick={() => navigateToCooking(recipe.id)}>
            <Flame size={14} className="me-1" /> Cook Now
          </button>
        </div>
      </div>
    </div>
  );
};

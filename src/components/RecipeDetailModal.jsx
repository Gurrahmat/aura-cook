import React from 'react';
import { useKitchen } from '../context/KitchenContext';
import { X, ShoppingBag, Check, Flame } from 'lucide-react';

export const RecipeDetailModal = ({ recipe, onClose }) => {
  const { pantry, navigateToCooking } = useKitchen();
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
                <img src={recipe.image} className="img-fluid rounded-4 shadow-sm mb-3" alt={recipe.title} />
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
                navigateToCooking(recipe.id);
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

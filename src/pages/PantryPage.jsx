import React, { useState } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { Search, Plus, Sparkles, Edit, Trash2, ChefHat, X } from 'lucide-react';

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
  const { 
    pantry, 
    recipes, 
    addPantryItem, 
    updatePantryItem, 
    deletePantryItem, 
    resetPantryToStaples, 
    computeRecipeMatch,
    navigateToCooking 
  } = useKitchen();

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

    if (editItem) {
      updatePantryItem(editItem.id, {
        name: formName.trim(),
        quantity: parseFloat(formQty) || 1,
        unit: formUnit.trim(),
        category: formCat,
        expiryDate: formExpiry,
        status: formStatus
      });
    } else {
      addPantryItem({
        name: formName.trim(),
        quantity: parseFloat(formQty) || 1,
        unit: formUnit.trim(),
        category: formCat,
        expiryDate: formExpiry,
        status: formStatus
      });
    }
    setShowModal(false);
  };

  const filteredPantry = pantry.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || item.category === category;
    return matchSearch && matchCat;
  });

  const recipeMatches = recipes.map(recipe => ({
    recipe,
    match: computeRecipeMatch(recipe)
  })).sort((a, b) => b.match.percent - a.match.percent);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h1 className="h2 font-serif mb-1">Digital Pantry Inventory</h1>
          <p className="text-muted mb-0">Track kitchen stock, monitor expiry dates, and unlock recipe recommendations.</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-secondary" onClick={resetPantryToStaples}>
            <Sparkles size={16} className="me-1" /> Populate Common Staples
          </button>
          <button className="btn btn-auracook-primary" onClick={openAddModal}>
            <Plus size={16} className="me-1" /> Add Ingredient
          </button>
        </div>
      </div>

      {/* Toolbar */}
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

      {/* Content Grid */}
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
                            <button className="btn btn-sm btn-outline-danger" onClick={() => deletePantryItem(item.id)}>
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

        {/* Sidebar */}
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
                    onClick={() => navigateToCooking(recipe.id)}
                  >
                    Cook
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
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
                        className="form-control" 
                        required 
                        value={formQty}
                        onChange={(e) => setFormQty(e.target.value)}
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

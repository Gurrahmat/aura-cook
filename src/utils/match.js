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

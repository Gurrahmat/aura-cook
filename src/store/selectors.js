import { createSelector } from '@reduxjs/toolkit';
import { DEFAULT_RECIPES } from '../data/recipes';
import { computeRecipeMatch } from '../utils/match';

export const selectRecipes = () => DEFAULT_RECIPES;

export const selectPantryItems = (state) => state.pantry.items;
export const selectTimers = (state) => state.timers.timers;
export const selectTimerCount = (state) => state.timers.timers.length;
export const selectToasts = (state) => state.ui.toasts;
export const selectCurrentPage = (state) => state.ui.currentPage;
export const selectActiveRecipeId = (state) => state.ui.activeRecipeId;
export const selectIsTimerDrawerOpen = (state) => state.ui.isTimerDrawerOpen;

export const makeSelectRecipeMatch = () =>
  createSelector(
    [(state, recipe) => recipe, selectPantryItems],
    (recipe, pantry) => computeRecipeMatch(recipe, pantry)
  );

export const makeSelectRankedRecipes = () =>
  createSelector(
    [selectRecipes, selectPantryItems],
    (recipes, pantry) =>
      recipes
        .map(recipe => ({ recipe, match: computeRecipeMatch(recipe, pantry) }))
        .sort((a, b) => b.match.percent - a.match.percent)
  );

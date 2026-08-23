export const DEFAULT_RECIPES = [
  {
    id: "tuscan-chicken",
    title: "Creamy Tuscan Garlic Chicken",
    category: "Main Course",
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    tags: ["Chicken", "Creamy", "Italian", "Gluten-Free"],
    description: "Tender chicken breasts pan-seared and smothered in a rich garlic cream sauce with sun-dried tomatoes and fresh spinach.",
    ingredients: [
      { name: "Chicken Breast", amount: 2, unit: "large" },
      { name: "Olive Oil", amount: 2, unit: "tbsp" },
      { name: "Garlic", amount: 4, unit: "cloves" },
      { name: "Heavy Cream", amount: 1, unit: "cup" },
      { name: "Sun-dried Tomatoes", amount: 0.5, unit: "cup" },
      { name: "Fresh Spinach", amount: 2, unit: "cups" },
      { name: "Parmesan Cheese", amount: 0.5, unit: "cup" },
      { name: "Salt", amount: 1, unit: "tsp" },
      { name: "Black Pepper", amount: 0.5, unit: "tsp" }
    ],
    instructions: [
      {
        step: 1,
        text: "Season the chicken breasts generously on both sides with 1 tsp salt and 0.5 tsp black pepper.",
        tools: ["Cutting Board", "Chef Knife"],
        ingredients: ["Chicken Breast", "Salt", "Black Pepper"],
        timerMinutes: 0
      },
      {
        step: 2,
        text: "Heat 2 tbsp Olive Oil in a large cast-iron skillet over medium-high heat. Add chicken breasts and sear until golden brown.",
        tools: ["Cast-iron Skillet", "Tongs"],
        ingredients: ["Olive Oil"],
        timerMinutes: 6
      },
      {
        step: 3,
        text: "Flip the chicken breasts and cook for another 6-8 minutes until internal temperature reaches 165°F (74°C). Transfer chicken to a plate.",
        tools: ["Meat Thermometer", "Plate"],
        ingredients: [],
        timerMinutes: 7
      },
      {
        step: 4,
        text: "In the same skillet, add minced Garlic and chopped Sun-dried Tomatoes. Sauté for 1-2 minutes until fragrant.",
        tools: ["Wooden Spoon"],
        ingredients: ["Garlic", "Sun-dried Tomatoes"],
        timerMinutes: 2
      },
      {
        step: 5,
        text: "Reduce heat to medium-low. Pour in 1 cup Heavy Cream and bring to a gentle simmer, scraping up any browned bits.",
        tools: ["Whisk"],
        ingredients: ["Heavy Cream"],
        timerMinutes: 3
      },
      {
        step: 6,
        text: "Stir in Parmesan Cheese and Fresh Spinach until cheese melts and spinach wilts down completely into the sauce.",
        tools: ["Wooden Spoon"],
        ingredients: ["Parmesan Cheese", "Fresh Spinach"],
        timerMinutes: 2
      },
      {
        step: 7,
        text: "Return the seared chicken breasts to the skillet, spoon cream sauce over the top, and let simmer for 2 minutes before serving hot.",
        tools: ["Serving Platter"],
        ingredients: [],
        timerMinutes: 2
      }
    ]
  },
  {
    id: "tomato-pasta",
    title: "Creamy Tomato & Mushroom Pasta",
    category: "Quick & Easy",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 15,
    servings: 3,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegetarian", "Pasta", "Italian", "Comfort Food"],
    description: "Al dente fettuccine tossed in a rich, velvety tomato garlic cream sauce filled with sautéed mushrooms and fresh basil.",
    ingredients: [
      { name: "Fettuccine Pasta", amount: 250, unit: "g" },
      { name: "Mushrooms", amount: 200, unit: "g" },
      { name: "Crushed Tomatoes", amount: 1, unit: "can" },
      { name: "Heavy Cream", amount: 0.5, unit: "cup" },
      { name: "Garlic", amount: 3, unit: "cloves" },
      { name: "Olive Oil", amount: 1.5, unit: "tbsp" },
      { name: "Fresh Basil", amount: 0.25, unit: "cup" },
      { name: "Parmesan Cheese", amount: 0.25, unit: "cup" },
      { name: "Salt", amount: 1, unit: "tsp" }
    ],
    instructions: [
      {
        step: 1,
        text: "Bring a large pot of salted water to a rolling boil. Add 250g Fettuccine and cook until al dente.",
        tools: ["Large Pot", "Colander"],
        ingredients: ["Fettuccine Pasta", "Salt"],
        timerMinutes: 9
      },
      {
        step: 2,
        text: "Heat Olive Oil in a pan. Add sliced Mushrooms and sauté until golden brown and liquid evaporates.",
        tools: ["Skillet", "Spatula"],
        ingredients: ["Mushrooms", "Olive Oil"],
        timerMinutes: 5
      },
      {
        step: 3,
        text: "Add minced Garlic and cook for 1 minute. Add Crushed Tomatoes and simmer for 5 minutes.",
        tools: ["Wooden Spoon"],
        ingredients: ["Garlic", "Crushed Tomatoes"],
        timerMinutes: 5
      },
      {
        step: 4,
        text: "Stir in Heavy Cream and Parmesan Cheese until smooth and creamy.",
        tools: ["Spatula"],
        ingredients: ["Heavy Cream", "Parmesan Cheese"],
        timerMinutes: 2
      },
      {
        step: 5,
        text: "Toss pasta with sauce, garnish with torn Fresh Basil leaves and serve immediately.",
        tools: ["Pasta Tongs"],
        ingredients: ["Fresh Basil"],
        timerMinutes: 0
      }
    ]
  },
  {
    id: "mediterranean-bowl",
    title: "Mediterranean Quinoa Bowl",
    category: "Vegetarian",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    tags: ["Healthy", "Quinoa", "Vegetarian", "Meal Prep"],
    description: "Fluffy quinoa topped with spiced roasted chickpeas, crisp cucumbers, cherry tomatoes, olives, and feta with lemon herb dressing.",
    ingredients: [
      { name: "Quinoa", amount: 1, unit: "cup" },
      { name: "Chickpeas", amount: 1, unit: "can" },
      { name: "Cucumber", amount: 1, unit: "medium" },
      { name: "Cherry Tomatoes", amount: 1, unit: "cup" },
      { name: "Feta Cheese", amount: 0.5, unit: "cup" },
      { name: "Lemon", amount: 1, unit: "whole" },
      { name: "Olive Oil", amount: 2, unit: "tbsp" }
    ],
    instructions: [
      {
        step: 1,
        text: "Rinse 1 cup Quinoa under cold water. Combine with 2 cups water in a pot, bring to a boil, cover and simmer for 15 minutes.",
        tools: ["Saucepan", "Lid"],
        ingredients: ["Quinoa"],
        timerMinutes: 15
      },
      {
        step: 2,
        text: "Drain and pat dry Chickpeas. Toss with Olive Oil and spices, then roast in oven or pan until crispy.",
        tools: ["Baking Sheet"],
        ingredients: ["Chickpeas", "Olive Oil"],
        timerMinutes: 12
      },
      {
        step: 3,
        text: "Dice Cucumber and halve Cherry Tomatoes. Fluff cooked quinoa with a fork.",
        tools: ["Knife", "Fork"],
        ingredients: ["Cucumber", "Cherry Tomatoes"],
        timerMinutes: 0
      },
      {
        step: 4,
        text: "Assemble bowls: base of quinoa, arranged vegetables, roasted chickpeas, crumbled Feta Cheese, and lemon juice drizzle.",
        tools: ["Serving Bowls"],
        ingredients: ["Feta Cheese", "Lemon"],
        timerMinutes: 0
      }
    ]
  },
  {
    id: "honey-salmon",
    title: "Cozy Honey Glazed Salmon",
    category: "Seafood",
    difficulty: "Medium",
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    tags: ["Seafood", "Glazed", "Omega-3", "Quick"],
    description: "Pan-roasted salmon fillets drizzled with a warm garlic, honey, and soy glaze alongside tender roasted asparagus.",
    ingredients: [
      { name: "Salmon Fillet", amount: 2, unit: "pieces" },
      { name: "Honey", amount: 2, unit: "tbsp" },
      { name: "Soy Sauce", amount: 1, unit: "tbsp" },
      { name: "Garlic", amount: 2, unit: "cloves" },
      { name: "Butter", amount: 1, unit: "tbsp" },
      { name: "Lemon", amount: 1, unit: "whole" },
      { name: "Asparagus", amount: 1, unit: "bunch" }
    ],
    instructions: [
      {
        step: 1,
        text: "Pat Salmon Fillets dry with paper towels. Whisk together Honey, Soy Sauce, minced Garlic, and 1 tbsp Lemon juice.",
        tools: ["Small Bowl", "Whisk"],
        ingredients: ["Salmon Fillet", "Honey", "Soy Sauce", "Garlic", "Lemon"],
        timerMinutes: 0
      },
      {
        step: 2,
        text: "Melt Butter in a non-stick pan over medium heat. Place salmon skin-side up and sear for 4 minutes until golden.",
        tools: ["Non-stick Pan", "Spatula"],
        ingredients: ["Butter"],
        timerMinutes: 4
      },
      {
        step: 3,
        text: "Flip salmon fillets carefully. Pour honey garlic glaze over salmon and simmer until sauce thickens into a glossy glaze.",
        tools: ["Spoon"],
        ingredients: [],
        timerMinutes: 4
      },
      {
        step: 4,
        text: "Serve hot garnished with lemon slices and trimmed sautéed Asparagus.",
        tools: ["Platter"],
        ingredients: ["Asparagus"],
        timerMinutes: 0
      }
    ]
  }
];

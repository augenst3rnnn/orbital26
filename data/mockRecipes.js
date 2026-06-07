//fake recipe for testing, avoid API limits
//tabs: all + types - breakfast, main course, snack, dessert (2 each)

export const mockRecipes = [
  {
    id: 1,
    title: "Chicken Pasta",
    type: "main course",
    image: "https://spoonacular.com/recipeImages/716429-312x231.jpg",

    usedIngredientCount: 4,
    missedIngredientCount: 2,

    likes: 20,
    readyInMinutes: 20,
    servings: 2,

    summary: "A delicious chicken pasta recipe with a creamy sauce.",

    instructions: [
      "Cook the chicken in a pan until browned.",
      "Boil the pasta according to package instructions.",
      "Prepare the sauce by combining cream, garlic, and Parmesan cheese.",
      "Mix the cooked chicken and pasta with the sauce.",
      "Serve hot and enjoy!",
    ],
  },

  {
    id: 2,
    title: "Vegetable Stir Fry",
    type: "main course",
    image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",

    usedIngredientCount: 3,
    missedIngredientCount: 1,

    likes: 15,
    readyInMinutes: 15,
    servings: 2,

    summary: "A quick and healthy vegetable stir fry recipe.",

    instructions: [
      "Heat oil in a wok or large pan.",
      "Add chopped vegetables (e.g., bell peppers, broccoli, carrots) and stir fry for 5-7 minutes.",
      "Add soy sauce and garlic for flavor.",
      "Serve over rice or noodles.",
    ],
  },

  {
    id: 3,
    title: "Pancakes",
    type: "breakfast",
    image: "https://spoonacular.com/recipeImages/715495-312x231.jpg",

    usedIngredientCount: 2,
    missedIngredientCount: 0,

    likes: 30,
    readyInMinutes: 10,
    servings: 4,

    summary: "Fluffy pancakes perfect for a weekend breakfast.",

    instructions: [
      "In a bowl, mix flour, sugar, baking powder, and salt.",
      "In another bowl, whisk milk, eggs, and melted butter.",
      "Combine the wet and dry ingredients until just mixed.",
      "Heat a griddle and pour batter to form pancakes.",
      "Cook until bubbles form, then flip and cook until golden.",
    ],
  },

  {
    id: 4,
    title: "Overnight Oats",
    type: "breakfast",
    image: "https://spoonacular.com/recipeImages/715497-312x231.jpg",

    usedIngredientCount: 3,
    missedIngredientCount: 1,

    likes: 25,
    readyInMinutes: 5,
    servings: 2,

    summary: "A simple and nutritious overnight oats recipe.",

    instructions: [
      "In a jar, combine rolled oats, milk, yogurt, and sweetener.",
      "Add your choice of toppings (e.g., fruits, nuts, seeds).",
      "Stir well, cover, and refrigerate overnight.",
      "In the morning, give it a good stir and enjoy!",
    ],
  },

  {
    id: 5,
    title: "Hummus with Veggies:",
    type: "snack",
    image: "https://spoonacular.com/recipeImages/715426-312x231.jpg",

    usedIngredientCount: 2,
    missedIngredientCount: 0,

    likes: 10,
    readyInMinutes: 10,
    servings: 4,

    summary: "A healthy and delicious hummus recipe served with fresh veggies.",

    instructions: [
      "In a food processor, combine chickpeas, tahini, lemon juice, garlic, and olive oil.",
      "Blend until smooth and creamy.",
      "Season with salt and pepper to taste.",
      "Serve with sliced vegetables like carrots, cucumbers, and bell peppers.",
    ],
  },

  {
    id: 6,
    title: "Fruit Salad",
    type: "snack",
    image: "https://spoonacular.com/recipeImages/715415-312x231.jpg",

    usedIngredientCount: 4,
    missedIngredientCount: 0,

    likes: 18,
    readyInMinutes: 10,
    servings: 4,

    summary: "A refreshing and colorful fruit salad recipe.",

    instructions: [
      "Chop a variety of fresh fruits (e.g., strawberries, blueberries, kiwi, mango).",
      "In a large bowl, combine the chopped fruits.",
      "Drizzle with honey and a squeeze of lemon juice.",
      "Toss gently to combine and serve chilled.",
    ],
  },

  {
    id: 7,
    title: "Chocolate Chip Cookies",
    type: "dessert",
    image: "https://spoonacular.com/recipeImages/715495-312x231.jpg",

    usedIngredientCount: 3,
    missedIngredientCount: 1,

    likes: 50,
    readyInMinutes: 30,
    servings: 24,

    summary:
      "Classic chocolate chip cookies that are crispy on the edges and chewy in the center.",

    instructions: [
      "Preheat oven to 350°F (175°C).",
      "In a bowl, cream together butter and sugars until light and fluffy.",
      "Beat in eggs one at a time, then stir in vanilla extract.",
      "In another bowl, combine flour, baking soda, and salt.",
      "Gradually blend the dry ingredients into the wet mixture.",
      "Stir in chocolate chips.",
      "Drop by rounded spoonfuls onto ungreased baking sheets.",
      "Bake for 10-12 minutes or until edges are golden brown.",
    ],
  },

  {
    id: 8,
    title: "Lemon Bars",
    type: "dessert",
    image: "https://spoonacular.com/recipeImages/715497-312x231.jpg",

    usedIngredientCount: 4,
    missedIngredientCount: 0,

    likes: 35,
    readyInMinutes: 45,
    servings: 16,

    summary: "Tangy and sweet lemon bars with a buttery crust.",

    instructions: [
      "Preheat oven to 350°F (175°C).",
      "In a bowl, combine flour, powdered sugar, and salt.",
      "Cut in cold butter until the mixture resembles coarse crumbs.",
      "Press the mixture into the bottom of a greased baking pan.",
      "Bake for 15-20 minutes or until lightly golden.",
      "In another bowl, whisk together eggs, granulated sugar, lemon juice, and flour.",
      "Pour the lemon mixture over the baked crust.",
      "Bake for an additional 20-25 minutes or until the filling is set.",
      "Allow to cool before dusting with powdered sugar and slicing into bars.",
    ],
  },
];

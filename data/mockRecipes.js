//fake recipe for testing, avoid API limits
//tabs: all + types - breakfast, main course, snack, dessert (2 each)

export const mockRecipes = [
  {
    id: 1,
    title: "Chicken Pasta",
    type: "main course",
    image: require("../assets/mockImages/chickenPasta.jpeg"),

    ingredients: [
      "200g chicken breast",
      "200g pasta",
      "1 cup heavy cream",
      "2 cloves garlic",
      "1/2 cup grated Parmesan cheese",
    ],
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

    nutrition: {
      calories: 650,
      protein: 35,
      carbs: 60,
      fat: 28,
      fiber: 4,
      healthScore: 45

    },
  },

  {
    id: 2,
    title: "Vegetable Stir Fry",
    type: "main course",
    image: require("../assets/mockImages/vegetableStirFry.jpeg"),

    ingredients: [
      "1 cup broccoli florets",
      "1 cup sliced bell peppers",
      "1 cup sliced carrots",
      "2 tablespoons soy sauce",
      "1 tablespoon vegetable oil",
    ],
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

    nutrition: {
      calories: 250,
      protein: 8,
      carbs: 30,
      fat: 12,
      fiber: 6,
      healthScore: 78
    }
  },

  {
    id: 3,
    title: "Pancakes",
    type: "breakfast",
    image: require("../assets/mockImages/pancakes.jpeg"),
    ingredients: [
      "1 cup all-purpose flour",
      "2 tablespoons sugar",
      "2 teaspoons baking powder",
      "1/2 teaspoon salt",
      "1 cup milk",
      "2 large eggs",
      "1/4 cup melted butter",
    ],
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

    nutrition: {
      calories: 350,
      protein: 10,
      carbs: 45,
      fat: 14,
      fiber: 2,
      healthScore: 52
    }
  },

  {
    id: 4,
    title: "Overnight Oats",
    type: "breakfast",
    image: require("../assets/mockImages/overnightOats.jpeg"),

    ingredients: [
      "1/2 cup old-fashioned oats",
      "2/3 cup milk of choice",
      "1/4 cup greek yogurt",
      "1 tablespoon chia seeds",
      "1 tablespoon honey",
    ],
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

    nutrition: {
      calories: 280,
      protein: 12,
      carbs: 40,
      fat: 8,
      fiber: 7,
      healthScore: 82
    }
  },

  {
    id: 5,
    title: "Hummus with Veggies:",
    type: "snack",
    image: require("../assets/mockImages/hummusWithVeggies.jpeg"),

    ingredients: [
      "1 can chickpeas",
      "1/2 cup sesame paste",
      "2 tablespoons olive oil",
      "2 tablespoons lemon juice",
      "2 cloves garlic, minced",
      "1/2 teaspoon salt",
      "diced vegetables",
    ],
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

    nutrition: {
      calories: 114,
      protein: 3,
      carbs: 13,
      fat: 5,
      fiber: 1,
      healthScore: 68
    }
  },

  {
    id: 6,
    title: "Fruit Salad",
    type: "snack",
    image: require("../assets/mockImages/fruitSalad.jpeg"),

    ingredients: [
      "1 cup pineapples",
      "1 cup strawberries",
      "2 kiwis",
      "1 cup seedless grapes",
      "1 cup blueberries",
    ],
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

    nutrition: {
      calories: 120,
      protein: 1,
      carbs: 30,
      fat: 0,
      fiber: 4,
      healthScore: 92
    }
  },

  {
    id: 7,
    title: "Chocolate Chip Cookies",
    type: "dessert",
    image: require("../assets/mockImages/chocolateChipCookies.jpeg"),

    ingredients: [
      "1 cup butter",
      "3/4 cup granulated white sugar",
      "2 large eggs",
      "2 teaspoons pure vanilla extract",
      "2 cups all-purpose flour",
      "1 teaspoon baking soda",
      "1/2 teaspoon salt",
      "2 cups chocolate chips",
    ],
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

    nutrition: {
      calories: 180,
      protein: 2,
      carbs: 24,
      fat: 9,
      fiber: 1,
      healthScore: 35
    }
  },

  {
    id: 8,
    title: "Lemon Bars",
    type: "dessert",
    image: require("../assets/mockImages/lemonBars.jpeg"),

    ingredients: [
      "1 cup all-purpose flour",
      "1/2 cup powdered sugar",
      "1/4 teaspoon salt",
      "1/2 cup cold unsalted butter, cubed",
      "2 large eggs",
      "1 cup granulated sugar",
      "2 tablespoons all-purpose flour",
      "1/4 cup fresh lemon juice",
    ],
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

    nutrition: {
      calories: 140,
      protein: 2,
      carbs: 22,
      fat: 5,
      fiber: 0,
      healthScore: 40
    }
  },
];

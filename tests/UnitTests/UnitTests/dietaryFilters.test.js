import { describe, it, expect } from "vitest";
import { matchesDietaryPreferences } from "../../../config/dietaryFilters";

describe("Dietary Preference Filters", () => {
  //helper function to create test recipes
  const createTestRecipe = (title, ingredients = []) => ({
    title,
    ingredients: ingredients.map((name) => ({ name })),
  });

  //vegetarian tests
  describe("Vegetarian Filter", () => {
    it("filters out recipes with chicken", () => {
      const recipe = createTestRecipe("Chicken Soup", ["chicken", "carrots"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegetarian"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with beef", () => {
      const recipe = createTestRecipe("Beef Stew", ["beef", "potatoes"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegetarian"],
      );
      expect(result).toBe(false);
    });

    it("allows recipes with no meat", () => {
      const recipe = createTestRecipe("Vegetable Soup", [
        "carrots",
        "onions",
        "potatoes",
      ]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegetarian"],
      );
      expect(result).toBe(true);
    });

    it("allows recipes with dairy (vegetarian can have dairy)", () => {
      const recipe = createTestRecipe("Cheese Pasta", ["pasta", "cheese"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegetarian"],
      );
      expect(result).toBe(true);
    });
  });

  //vegan tests
  describe("Vegan Filter", () => {
    it("filters out recipes with dairy", () => {
      const recipe = createTestRecipe("Cheese Pasta", ["pasta", "cheese"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegan"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with eggs", () => {
      const recipe = createTestRecipe("Omelette", ["eggs", "vegetables"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegan"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with honey", () => {
      const recipe = createTestRecipe("Honey Oatmeal", ["oats", "honey"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegan"],
      );
      expect(result).toBe(false);
    });

    it("allows recipes with only plant-based ingredients", () => {
      const recipe = createTestRecipe("Vegan Chili", [
        "beans",
        "tomatoes",
        "onions",
      ]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegan"],
      );
      expect(result).toBe(true);
    });
  });

  //dairy-free tests
  describe("Dairy-Free Filter", () => {
    it("filters out recipes with milk", () => {
      const recipe = createTestRecipe("Mac and Cheese", [
        "pasta",
        "milk",
        "cheese",
      ]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["dairyFree"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with butter", () => {
      const recipe = createTestRecipe("Butter Chicken", ["chicken", "butter"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["dairyFree"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with cream", () => {
      const recipe = createTestRecipe("Creamy Soup", ["soup", "cream"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["dairyFree"],
      );
      expect(result).toBe(false);
    });

    it("allows recipes without dairy", () => {
      const recipe = createTestRecipe("Grilled Salmon", [
        "salmon",
        "lemon",
        "herbs",
      ]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["dairyFree"],
      );
      expect(result).toBe(true);
    });
  });

  //gluten-free tests
  describe("Gluten-Free Filter", () => {
    it("filters out recipes with wheat", () => {
      const recipe = createTestRecipe("Pasta", ["pasta", "tomato sauce"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["glutenFree"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with bread", () => {
      const recipe = createTestRecipe("Sandwich", ["bread", "ham"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["glutenFree"],
      );
      expect(result).toBe(false);
    });

    it("allows recipes without gluten", () => {
      const recipe = createTestRecipe("Rice Bowl", [
        "rice",
        "chicken",
        "vegetables",
      ]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["glutenFree"],
      );
      expect(result).toBe(true);
    });
  });

  //halal tests
  describe("Halal Filter", () => {
    it("filters out recipes with pork", () => {
      const recipe = createTestRecipe("Pork Rice", ["pork", "rice"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["halal"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with bacon", () => {
      const recipe = createTestRecipe("Bacon and Eggs", ["bacon", "eggs"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["halal"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with ham", () => {
      const recipe = createTestRecipe("Ham Sandwich", ["ham", "bread"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["halal"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with gelatin", () => {
      const recipe = createTestRecipe("Fruit Jelly", ["gelatin", "fruit"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["halal"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with alcohol", () => {
      const recipe = createTestRecipe("Beef Stew", ["beef", "wine"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["halal"],
      );
      expect(result).toBe(false);
    });

    it("allows recipes without pork, alcohol, or gelatin", () => {
      const recipe = createTestRecipe("Chicken Rice", [
        "chicken",
        "rice",
        "vegetables",
      ]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["halal"],
      );
      expect(result).toBe(true);
    });
  });

  //ketogenic tests
  describe("Ketogenic Filter", () => {
    it("filters out recipes with sugar", () => {
      const recipe = createTestRecipe("Cake", ["flour", "sugar", "eggs"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["ketogenic"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with rice", () => {
      const recipe = createTestRecipe("Fried Rice", ["rice", "vegetables"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["ketogenic"],
      );
      expect(result).toBe(false);
    });

    it("allows recipes without carbs", () => {
      const recipe = createTestRecipe("Steak", ["beef", "butter"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["ketogenic"],
      );
      expect(result).toBe(true);
    });
  });

  //paleo tests
  describe("Paleo Filter", () => {
    it("filters out recipes with dairy", () => {
      const recipe = createTestRecipe("Cheese Omelette", ["eggs", "cheese"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["paleo"],
      );
      expect(result).toBe(false);
    });

    it("filters out recipes with grains", () => {
      const recipe = createTestRecipe("Bread", ["flour", "water"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["paleo"],
      );
      expect(result).toBe(false);
    });

    it("allows recipes with paleo-friendly ingredients", () => {
      const recipe = createTestRecipe("Grilled Salmon", [
        "salmon",
        "vegetables",
      ]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["paleo"],
      );
      expect(result).toBe(true);
    });
  });

  //multiple preferences tests
  describe("Multiple Dietary Preferences", () => {
    it("filters out recipe that does not meet all preferences", () => {
      const recipe = createTestRecipe("Chicken Cheese Pasta", [
        "chicken",
        "pasta",
        "cheese",
      ]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["halal", "dairyFree"],
      );
      expect(result).toBe(false);
    });

    it("allows recipe that meets all preferences", () => {
      const recipe = createTestRecipe("Grilled Chicken", [
        "chicken",
        "rice",
        "vegetables",
      ]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["halal", "dairyFree"],
      );
      expect(result).toBe(true);
    });

    it("filters out recipe when one preference fails (vegetarian + vegan)", () => {
      const recipe = createTestRecipe("Cheese Pizza", ["dough", "cheese"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegetarian", "vegan"],
      );
      expect(result).toBe(false);
    });

    it("allows recipe when all preferences pass (vegetarian + dairyFree)", () => {
      const recipe = createTestRecipe("Vegetable Stir Fry", [
        "vegetables",
        "tofu",
        "rice",
      ]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegetarian", "dairyFree"],
      );
      expect(result).toBe(true);
    });
  });

  //edge cases
  describe("Edge Cases", () => {
    it("handles case-insensitive matching", () => {
      const recipe = createTestRecipe("Chicken Soup", ["Chicken"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegetarian"],
      );
      expect(result).toBe(false);
    });

    it("handles case-insensitive matching for Halal", () => {
      const recipe = createTestRecipe("Pork Dish", ["Pork"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["halal"],
      );
      expect(result).toBe(false);
    });

    it("handles partial ingredient matches", () => {
      const recipe = createTestRecipe("Test Recipe", ["chicken broth"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegetarian"],
      );
      expect(result).toBe(false);
    });

    it("handles partial ingredient matches for Halal", () => {
      const recipe = createTestRecipe("Test Recipe", ["pork sausage"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["halal"],
      );
      expect(result).toBe(false);
    });

    it("handles empty ingredient list", () => {
      const recipe = createTestRecipe("Water", []);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["vegetarian"],
      );
      expect(result).toBe(true);
    });

    it("handles no dietary preferences", () => {
      const recipe = createTestRecipe("Chicken Soup", ["chicken"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        [],
      );
      expect(result).toBe(true);
    });

    it("handles unknown dietary preference", () => {
      const recipe = createTestRecipe("Chicken Soup", ["chicken"]);
      const result = matchesDietaryPreferences(
        recipe.title,
        recipe.ingredients,
        ["unknown-preference"],
      );
      expect(result).toBe(true);
    });
  });
});

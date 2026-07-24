import React from "react";

import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";

import useAuth from "../../config/hooks/useAuth";

import ExploreRecipeScreen from "../../screens/ExploreRecipeScreen";
import RecipeDetailsScreen from "../../screens/RecipeDetailsScreen";

//import functions called in ExploreRecipeScreen & RecipeDetailsScreen
import {
  searchRecipesByName,
  getRecipeDetails,
  searchIngredientByName,
} from "../../config/services/spoonacularService";
import {
  getFavoriteRecipes,
  removeFavoriteRecipe,
  saveFavoriteRecipe,
  saveMealForDay,
} from "../../config/firestoreService";

//add mocks before testing => calls function but without real API request
jest.mock("../../config/services/spoonacularService", () => ({
  searchRecipesByName: jest.fn(),
  getRecipeDetails: jest.fn(),
}));

jest.mock("../../config/firestoreService", () => ({
  getFavoriteRecipes: jest.fn(),
  saveFavoriteRecipe: jest.fn(),
  removeFavoriteRecipe: jest.fn(),
  saveMealForDay: jest.fn(),
}));

//RecipeDetailsScreen directly uses auth.currentUser.uid
jest.mock("../../config/firebase", () => ({
  auth: {
    currentUser: {
      uid: "test-user-123",
    },
  },
}));

//RDS renders real NutritonSection (not part of this integration flow => mock it)
jest.mock("../../components/NutritionSection", () => {
  return function MockNutritionSection() {
    return null;
  };
});

describe("ExploreRecipeScreen integration", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("searches for a recipe and opens recipe modal", async () => {
    const recipeSearchResult = {
      id: 716429,
      title: "Pasta with Garlic",
      image: "https://example.com/pasta.jpg",
      readyInMinutes: 30,
      servings: 2,
      summary: "A simple pasta recipe.",
      usedIngredientCount: 2,
      missedIngredientCount: 1,
    };

    searchRecipesByName.mockResolvedValue([recipeSearchResult]);

    const navigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const user = userEvent.setup();

    render(<ExploreRecipeScreen navigation={navigation} />);

    await user.type(screen.getByTestId("recipe-search-input"), "pasta", {
      submitEditing: true,
    });

    await waitFor(() => {
      expect(searchRecipesByName).toHaveBeenCalledWith({
        searchQuery: "pasta",
        recipeType: "all",
        number: 10,
      });
    });

    expect(await screen.findByText("Pasta with Garlic")).toBeTruthy();

    expect(screen.getByText("30 mins | 2 servings")).toBeTruthy();

    //user presses recipe card to view modal
    await user.press(screen.getByTestId("recipe-card-716429"));

    expect(await screen.findByTestId("recipe-preview-modal")).toBeTruthy();

    expect(screen.getByText("2 available, 1 missing")).toBeTruthy();
  });
});

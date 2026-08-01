import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";

import { Alert } from "react-native";

import GroceryScreen from "../../screens/groceryScreens/GroceryScreen";
import MissingIngredientsScreen from "../../screens/groceryScreens/MissingIngredientsScreen";
import FullIngredientsScreen from "../../screens/groceryScreens/FullIngredientsScreen";
import {
  getFavoriteRecipes,
  getGroceryList,
  getIngredientInventory,
  updateIngredientStatus,
} from "../../config/firestoreService";
import {
  getIngredientInformation,
  getRecipeDetails,
  searchIngredientByName,
} from "../../config/services/spoonacularService";

import useAuth from "../../config/hooks/useAuth";
import { __esModule } from "@babel/core";

//import firestore/spoonacular functions used in the screens

//add mocks before testing
jest.mock("../../config/hooks/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../config/firestoreService", () => ({
  getIngredientInventory: jest.fn(),
  getFavoriteRecipes: jest.fn(),
  getGroceryList: jest.fn(),
  saveGroceryIngredient: jest.fn(),
  updateIngredientStatus: jest.fn(),
}));

jest.mock("../../config/services/spoonacularService", () => ({
  getIngredientInformation: jest.fn(),
  searchIngredientByName: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),

  useFocusEffect: jest.fn((callback) => {
    return callback();
  }),
}));

describe("MissingIngredientsScreen integration", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();

    useAuth.mockReturnValue({
      user: {
        uid: "test-user-123",
      },
    });

    getIngredientInventory.mockResolvedValue([]);
    getFavoriteRecipes.mockResolvedValue([]);
    getGroceryList.mockResolvedValue([]);
  });

  it("navigates to missing ingredients screen from grocery home page", async () => {
    const navigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const user = userEvent.setup();

    await render(<GroceryScreen navigation={navigation} />);

    //fetch firestore data when user opens the screen
    await waitFor(() => {
      expect(getIngredientInventory).toHaveBeenCalledWith("test-user-123");
      expect(getFavoriteRecipes).toHaveBeenCalledWith("test-user-123");
      expect(getGroceryList).toHaveBeenCalledWith("test-user-123");
    });

    await user.press(screen.getByTestId("nav-card-2"));

    expect(navigation.navigate).toHaveBeenCalledWith(
      "recipeMissingIngredients",
    );
  });

  it("navigates to full recipe ingredients screen", async () => {
    const favRecipe = {
      id: 716429,
      image: "https://example.com/pasta.jpg",
      ingredients: [],
      instructions: [],
      isMock: false,
      likes: 4,
      readyInMinutes: 30,
      servings: 2,
      summary: "A simple pasta recipe.",
      title: "Pasta with Garlic",
    };

    //ensure ur mock fav recipe is stored in the fav recipes array, ing array can be empty
    getFavoriteRecipes.mockResolvedValue([favRecipe]);
    getIngredientInventory.mockResolvedValue([]);

    const navigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const user = userEvent.setup();

    await render(<MissingIngredientsScreen navigation={navigation} />);

    await waitFor(() => {
      expect(getIngredientInventory).toHaveBeenCalledWith("test-user-123");
      expect(getFavoriteRecipes).toHaveBeenCalledWith("test-user-123");
    });

    //user clicks on recipe card - await first as findByTestId is async => Promise
    const recipeCard = await screen.findByTestId("favRecipeCard-716429");
    await user.press(recipeCard);

    expect(navigation.navigate).toHaveBeenCalledWith("recipeChecklist", {
      recipe: {
        ...favRecipe,
        missingIngredients: [],
      },
    });
  });

  it("adds missing ingredient to inventory", async () => {
    const garlic = {
      id: 11215,
      name: "garlic",
      amount: 2,
      unit: "cloves",
    };

    const favRecipe = {
      id: 716429,
      image: "https://example.com/pasta.jpg",
      title: "Pasta with Garlic",
      extendedIngredients: [garlic],
    };

    getIngredientInventory.mockResolvedValue([]);
    getGroceryList.mockResolvedValue([]);

    updateIngredientStatus.mockResolvedValue({
      ingredientInventory: [garlic],
      groceryList: [],
    });

    jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => {
      buttons.find((button) => button.text === "Add").onPress();
    });

    const navigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const route = {
      params: {
        recipe: favRecipe,
      },
    };

    const user = userEvent.setup();

    await render(
      <FullIngredientsScreen navigation={navigation} route={route} />,
    );

    //initial inventory & grocery list fetching
    expect(await screen.findByText("0 of 1 ingredients")).toBeTruthy();

    await user.press(screen.getByTestId("ingredient-11215"));

    await user.press(screen.getByTestId("status-have"));

    await waitFor(() => {
      expect(updateIngredientStatus).toHaveBeenCalledWith(
        "test-user-123",
        garlic,
        "have",
      );
    });

    expect(await screen.findByText("1 of 1 ingredients")).toBeTruthy();
  });

  //it("adds missing ingredient to cart", async () => {}
});

import React from "react";

//import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  render,
  screen,
  fireEvent,
  userEvent,
  waitFor,
} from "@testing-library/react-native";

import InventoryScreen from "../../screens/groceryScreens/InventoryScreen";

//import functions called in InventoryScreen
import {
  getIngredientInformation,
  searchIngredientByName,
} from "../../config/services/spoonacularService";

import {
  saveIngredient,
  getIngredientInventory,
  deleteIngredient,
} from "../../config/firestoreService";

import useAuth from "../../config/hooks/useAuth";
import { __esModule } from "@babel/core";

//add mocks before testing => calls function but without real API request
jest.mock("../../config/services/spoonacularService", () => ({
  getIngredientInformation: jest.fn(),
  searchIngredientByName: jest.fn(),
}));

jest.mock("../../config/firestoreService", () => ({
  saveIngredient: jest.fn(),
  getIngredientInventory: jest.fn(),
  deleteIngredient: jest.fn(),
}));

/*jest.mock("../../config/hooks/useAuth", () => ({
  default: jest.fn(() => ({
    user: {
      uid: "test-user-123",
    },
  })),
}));*/

jest.mock("../../config/hooks/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

//do NOT mock this! its part of the workflow being tested
/*jest.mock("../../components/AddIngredientModal", () => {
  return function MockAddIngredientModal() {
    return null;
  };
});*/

jest.mock("../../components/EditIngredientModal", () => {
  return function MockEditIngredientModal() {
    return null;
  };
});

describe("InventoryScreen integration", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();

    useAuth.mockReturnValue({
      user: {
        uid: "test-user-123",
      },
    });

    getIngredientInventory.mockResolvedValue([]);
  });

  it("adds an ingredient and displays it in inventory", async () => {
    const spoonacularSearchResult = {
      id: 1077,
      name: "milk",
      image: "milk.png",
    };

    const spoonacularIngredientDetails = {
      id: 1077,
      name: "milk",
      image: "milk.png",
      aisle: "Milk, Eggs, Other Dairy",
    };

    const savedIngredient = {
      ...spoonacularIngredientDetails,
      amount: 2,
      unit: "cartons",
    };

    //initial inventory load: nothing saved yet
    getIngredientInventory.mockResolvedValue([]);

    //spoonacular search & ingredient details response
    searchIngredientByName.mockResolvedValue([spoonacularSearchResult]);

    getIngredientInformation.mockResolvedValue(spoonacularIngredientDetails);

    //save in firestore
    saveIngredient.mockResolvedValue([savedIngredient]);

    const navigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    /*expect(useAuth()).toEqual({
      user: {
        uid: "test-user-123",
      },
    });*/
    const user = userEvent.setup();

    await render(<InventoryScreen navigation={navigation} />);

    //load user's inventory inside useEffect (async)
    await waitFor(() => {
      expect(getIngredientInventory).toHaveBeenCalledWith("test-user-123");
    });

    expect(screen.getByText("You have (0)")).toBeTruthy();

    //press yellow + button
    await user.press(screen.getByTestId("open-add-ingredient-modal"));

    expect(await screen.findByTestId("add-ingredient-modal")).toBeTruthy();

    //fill modal inputs
    await user.type(screen.getByTestId("ingredient-search-input"), "milk");

    await user.type(screen.getByTestId("ingredient-amount-input"), "2");

    await user.type(screen.getByTestId("ingredient-unit-input"), "cartons");

    await user.press(screen.getByTestId("save-ingredient-button"));

    //spoonacular search
    await waitFor(() => {
      expect(searchIngredientByName).toHaveBeenCalledWith("milk");
    });

    expect(getIngredientInformation).toHaveBeenCalledWith(1077);

    //firestore save
    await waitFor(() => {
      expect(saveIngredient).toHaveBeenCalledWith(
        "test-user-123",
        1077,
        expect.objectContaining({
          name: "milk",
          amount: 2,
          unit: "cartons",
          image: "milk.png",
          aisle: "Milk, Eggs, Other Dairy",
        }),
      );
    });

    //updated UI
    expect(await screen.findByText("milk")).toBeTruthy();

    expect(screen.getByText("2 cartons")).toBeTruthy();

    expect(screen.getByText("You have (1)")).toBeTruthy();
  });
});

//use in GroceryScreen to fetch missing count for saved recipes
//use in MissingIngredientsScreen to fetch missing ingredients for each recipe

export const getMissingIngredientsForRecipe = (
  recipeIngredients,
  inventory,
) => {
  return recipeIngredients.filter((recipeIng) => {
    const ownedIng = inventory.find(
      (invIng) => invIng.id === recipeIng.id || invIng.name === recipeIng.name,
    );

    //user does not own ingredient at all
    if (!ownedIng) {
      return true;
    }

    //user owns ingredient, but insufficient amount
    const recipeAmount = recipeIng.amount;
    const ownedAmount = ownedIng.amount;

    return ownedAmount < recipeAmount;
  });
};

//for FullIngredientsScreen - check ingredient's current status
export const normalizeIngredientName = (name = "") => name.trim().toLowerCase();

export const ingredientsMatch = (firstIngredient, secondIngredient) => {
  if (firstIngredient?.id != null && secondIngredient?.id != null) {
    return String(firstIngredient.id) === String(secondIngredient.id);
  }

  return (
    normalizeIngredientName(firstIngredient?.name) ===
    normalizeIngredientName(secondIngredient?.name)
  );
};

export const getIngredientStatus = (
  ingredient,
  ingredientInventory,
  groceryList,
) => {
  const inventoryMatch = ingredientInventory.some((inventoryIngredient) =>
    ingredientsMatch(inventoryIngredient, ingredient),
  );

  if (inventoryMatch) {
    return "have";
  }

  const groceryMatch = groceryList.find((groceryIngredient) =>
    ingredientsMatch(groceryIngredient, ingredient),
  );

  if (groceryMatch?.status === "inCart") {
    return "inCart";
  }

  //missing ingredients default to "toBuy"
  return "toBuy";
};

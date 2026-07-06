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

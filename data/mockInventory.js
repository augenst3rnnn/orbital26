export const mockInventory = [
  {
    id: 1123, //use real id, works when calling API data later
    name: "Egg",
    aisle: "Milk, Eggs, Other Dairy",
    amount: 12,
    unit: "eggs",
    image: require("../assets/mockImages/egg.png"),
    expiryDays: 5,
  },
  {
    id: 11529,
    name: "Tomato",
    aisle: "Produce",
    amount: 3,
    unit: "",
    image: require("../assets/mockImages/tomato.png"),
    expiryDays: 3,
  },
  {
    id: 1001,
    name: "Milk",
    aisle: "Milk, Eggs, Other Dairy",
    amount: 1,
    unit: "L",
    image: require("../assets/mockImages/milk.png"),
    expiryDays: 4,
  },
];

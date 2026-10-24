// Seed data: 5 restaurants, 10 foods (2 per restaurant)
export const restaurants = [
  { key: "smash", name: "Smash Station", cuisine: "Burgers", emoji: "🍔", rating: 4.7, etaMin: 25, deliveryFee: 0 },
  { key: "napoli", name: "Napoli Oven", cuisine: "Pizza", emoji: "🍕", rating: 4.8, etaMin: 30, deliveryFee: 1.5 },
  { key: "tokyo", name: "Tokyo Bowl", cuisine: "Asian", emoji: "🍜", rating: 4.6, etaMin: 35, deliveryFee: 2 },
  { key: "spice", name: "Spice Route", cuisine: "Curry", emoji: "🍛", rating: 4.5, etaMin: 40, deliveryFee: 1 },
  { key: "sugar", name: "Sugar Panda", cuisine: "Desserts & Drinks", emoji: "🍰", rating: 4.9, etaMin: 20, deliveryFee: 0 },
];

export const foods = [
  { r: "smash", name: "Classic Smash Burger", price: 8.5, emoji: "🍔", category: "Burgers", description: "Double patty, cheddar, pickles" },
  { r: "smash", name: "Crinkle Fries", price: 3.8, emoji: "🍟", category: "Sides", description: "Sea salt, garlic mayo" },
  { r: "napoli", name: "Margherita Pizza", price: 9.5, emoji: "🍕", category: "Pizza", description: "Tomato, mozzarella, basil" },
  { r: "napoli", name: "Diavola Pizza", price: 11.5, emoji: "🌶️", category: "Pizza", description: "Spicy salami, chilli oil" },
  { r: "tokyo", name: "Tonkotsu Ramen", price: 12.5, emoji: "🍜", category: "Noodles", description: "Pork broth, soft egg, nori" },
  { r: "tokyo", name: "Pork Gyoza", price: 5.9, emoji: "🥟", category: "Starters", description: "Pan-fried, six pieces" },
  { r: "spice", name: "Butter Chicken", price: 11.5, emoji: "🍛", category: "Curry", description: "Creamy tomato gravy with rice" },
  { r: "spice", name: "Garlic Naan", price: 2.8, emoji: "🫓", category: "Bread", description: "Fresh from the tandoor" },
  { r: "sugar", name: "Strawberry Cake", price: 6.5, emoji: "🍰", category: "Desserts", description: "Slice with fresh cream" },
  { r: "sugar", name: "Brown Sugar Boba", price: 5.2, emoji: "🧋", category: "Drinks", description: "Large, less ice" },
];

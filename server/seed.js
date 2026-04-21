const mongoose = require('mongoose');
const model = require('./models/model');

async function seed() {
  await mongoose.connect("mongodb://localhost:5000/expense-tracker");

  console.log("✅ Connected to MongoDB");

  // Clear old data
  await model.Categories.deleteMany({});
  await model.Transaction.deleteMany({});

  // Categories with fixed colors
  const categories = [
    { type: "Salary", color: "#3498db" },       // Blue
    { type: "House Rent", color: "#2ecc71" },   // Green
    { type: "Groceries", color: "#e74c3c" },    // Red
    { type: "Utilities", color: "#9b59b6" },    // Purple
    { type: "Entertainment", color: "#f1c40f" },// Yellow
    { type: "Investment", color: "#fc44e0" },   // Pink
    { type: "Savings", color: "#1abc9c" }       // Teal
  ];

  // Transactions
  const transactions = [
    {
      name: "Salary",
      type: "Salary",
      amount: 50000,
      budget: null,
      date: new Date("2026-04-01")
    },
    {
      name: "House Rent",
      type: "House Rent",
      amount: 15000,
      budget: 16000,
      date: new Date("2026-04-03")
    },
    {
      name: "Groceries",
      type: "Groceries",
      amount: 5000,
      budget: 6000,
      date: new Date("2026-04-05")
    },
    {
      name: "Electricity Bill",
      type: "Utilities",
      amount: 2000,
      budget: 2500,
      date: new Date("2026-04-07")
    },
    {
      name: "Movie Night",
      type: "Entertainment",
      amount: 1200,
      budget: 2000,
      date: new Date("2026-04-10")
    },
    {
      name: "Mutual Fund",
      type: "Investment",
      amount: 10000,
      budget: null,
      date: new Date("2026-04-12")
    },
    {
      name: "Emergency Fund",
      type: "Savings",
      amount: 3000,
      budget: null,
      date: new Date("2026-04-15")
    }
  ];

  await model.Categories.insertMany(categories);
  await model.Transaction.insertMany(transactions);

  console.log("✨ Seed data inserted successfully");
  process.exit();
}

seed().catch(err => console.error(err));

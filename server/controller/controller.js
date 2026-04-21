const model = require('../models/model');

// POST: http://localhost:5000/api/categories
async function create_Categories(req, res) {
  try {
    const { type, color } = req.body;
    const Create = new model.Categories({ type, color });
    await Create.save();
    return res.json(Create);
  } catch (err) {
    return res.status(400).json({ message: `Error while creating categories ${err}` });
  }
}

// GET: http://localhost:5000/api/categories
async function get_Categories(req, res) {
  try {
    let data = await model.Categories.find({});
    let filter = data.map(v => ({ type: v.type, color: v.color }));
    return res.json(filter);
  } catch (err) {
    return res.status(400).json({ message: `Error while fetching categories ${err}` });
  }
}

// POST: http://localhost:5000/api/transaction
async function create_Transaction(req, res) {
  if (!req.body) return res.status(400).json("Post HTTP Data not Provided");
  let { name, type, amount, budget } = req.body;

  try {
    amount = Number(amount);

    // Prevent duplicates
    const existing = await model.Transaction.findOne({ name, type, amount });
    if (existing) {
      return res.status(400).json({ message: "Transaction already exists" });
    }

    const create = new model.Transaction({
      name,
      type,
      amount,
      budget: budget ? Number(budget) : null,
      date: new Date()
    });

    await create.save();
    return res.json(create);
  } catch (err) {
    return res.status(400).json({ message: `Error while creating transaction ${err}` });
  }
}

// GET: http://localhost:5000/api/transaction
async function get_Transaction(req, res) {
  try {
    let data = await model.Transaction.find({});
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ message: `Error while fetching transactions ${err}` });
  }
}

// DELETE: http://localhost:5000/api/transaction
async function delete_Transaction(req, res) {
  if (!req.body) return res.status(400).json({ message: "Request body not Found" });
  try {
    await model.Transaction.deleteOne(req.body);
    return res.json("Record Deleted...!");
  } catch (err) {
    return res.status(400).json({ message: `Error while deleting Transaction Record ${err}` });
  }
}



// Utility: generate random color
function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// GET: http://localhost:5000/api/labels
async function get_Labels(req, res) {
  try {
    const transactions = await model.Transaction.find({});
    const categories = await model.Categories.find({});

    // ✅ Deduplicate by _id
    const uniqueTransactions = [...new Map(transactions.map(t => [t._id.toString(), t])).values()];

    const data = uniqueTransactions.map(t => ({
      ...t._doc,
      // If category color exists, use it; otherwise assign a unique random color
      color: transactions.find(c => c.type === t.type)?.color || randomColor()
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  create_Categories,
  get_Categories,
  create_Transaction,
  get_Transaction,
  delete_Transaction,
  get_Labels
};


const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const addTransaction = async (req, res) => {

   
  try {
    const userId=req.authData.id;
    console.log(userId);
    const user=await User.findOne({ _id: userId});

    //const user = await User.findById(userId);
    const { amount, description, date, category, type } = req.body;

    const transaction = await Transaction.create({
      amount,
      description,
      date,
      category,
      type,
      userId,
    });

    if (type === "expense") {
      user.totalExpense += amount;
    } else {
      user.totalIncome += amount;
    }

    await user.save();

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTransactionsByDateRange = async (start, end, userId, page, limit) => {
    const skipDocuments = (page - 1) * limit;
  
    const totalTransactions = await Transaction.countDocuments({
      userId,
      date: { $gte: start, $lt: end },
    });
    const transactions = await Transaction.find(
      { userId, date: { $gte: start, $lt: end } },
      { userId: 0 }
    )
      .sort({ date: -1 })
      .skip(skipDocuments)
      .limit(limit)
      .exec();
  
    const totalPages = Math.ceil(totalTransactions / limit);
    // return { totalTransactions, currentPage: page, totalPages, transactions };
    return {  transactions };
  
  };

const getTransactions = async (req, res) => {
    try {
    //   const userId = req.user.id;
    const userId=req.authData.id;

    
      const today = new Date();
  
      let start, end;
      const range = req.query.range || "all";
  
      if (range === "daily") {
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        end = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1
        );
      } else if (range === "weekly") {
        start = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - today.getDay()
        );
        end = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - today.getDay() + 7
        );
      } else if (range === "monthly") {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      } else if (range === "yearly") {
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear() + 1, 0, 1);
      } else {
        // All-time transactions
        start = new Date(0);
        end = new Date(today.getFullYear() + 1, 0, 1);
      }
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const response = await getTransactionsByDateRange(
        start,
        end,
        userId,
        page,
        limit
      );
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  };
  
  
  const allTransaction = async (req, res) => {
    try {
      const users = await User.find({}, { username: 1, totalExpense: 1, totalIncome: 1 });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const deleteTransaction = async (req, res) => {
    try {
      const transactionId = req.params.id;
    //   const userId = req.user.id;
       const userId=req.authData.id;

  
      // Find the transaction in the database by its ID and the associated userId
      const transaction = await Transaction.findOne({
        _id: transactionId,
        userId: userId,
      });
  
      // Check if the transaction exists
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
  
      // Delete the transaction from the database
      await transaction.deleteOne();
  
      // Update the user's totalExpense or totalIncome based on the type of the deleted transaction
      const user = await User.findById(userId);
      if (transaction.type === "expense") {
        user.totalExpense -= transaction.amount;
      } else {
        user.totalIncome -= transaction.amount;
      }
      await user.save();
  
      res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

module.exports = { addTransaction ,getTransactions,allTransaction,deleteTransaction};

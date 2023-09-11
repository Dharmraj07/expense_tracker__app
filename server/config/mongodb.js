const mongoose = require("mongoose");

const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");

const MONGO_URL = process.env.MONGO_URLL;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
    });

    console.log("DB connection is successful...");

    // Establish the relationship between User and Transaction
    // In MongoDB, we use references to create relationships between collections
    // The 'userId' field in the Transaction collection will reference the _id of the User collection
    Transaction.schema.path("userId", mongoose.Schema.Types.ObjectId, User.collection.name);

    // Return the Mongoose connection object
    return mongoose.connection;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
};

// Export the connectToDatabase function directly, no need for the self-executing function
module.exports = connectToDatabase;



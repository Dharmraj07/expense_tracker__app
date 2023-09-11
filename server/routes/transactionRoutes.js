const express=require("express");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middlewares/authenticateUser");
const { addTransaction, getTransactions, deleteTransaction, allTransaction } = require("../controller/transactionController");

// const { addTransaction } = require("../controller/transactionController");
// const { verifyToken } = require("../middlewares/authenticateUser");






const router = express.Router();

router.post("/transaction",verifyToken,addTransaction);
router.get("/transaction",verifyToken,getTransactions);

// router.get("/", verifyToken, getTransactions);
 router.get("/alltransaction",verifyToken,allTransaction);
router.delete("/transaction/:id", verifyToken, deleteTransaction);

module.exports=router;

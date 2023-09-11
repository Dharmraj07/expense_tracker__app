const express=require("express");
const { createUser, loginUser } = require("../controller/userController");
 const createPayment = require("../controller/paymentController");
const { verifyToken } = require("../middlewares/authenticateUser");
const { downloadTransactions } = require("../controller/download");



const router = express.Router();


router.post('/signin',loginUser );
router.post('/signup', createUser);
 router.post('/payment',verifyToken,createPayment);

// router.post('/payment',authenticateUser,createPayment);
// router.get('/alltransaction',allTransaction);
 router.get('/download/:id',downloadTransactions);

module.exports = router;
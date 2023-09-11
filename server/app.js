const express = require("express");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");


const connectToDatabase = require("./config/mongodb");
const userRouter = require("./routes/usersRoutes");
const transactionRoutes=require("./routes/transactionRoutes");

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set in .env


app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

 app.use("/", userRouter);
 app.use("/",transactionRoutes);
app.get("/", (req, res) => {
    res.json({
      message: "sample api"
    });
  });



// You should handle the application startup in your main application file (e.g., app.js)

// Example of how to use the connectToDatabase function in your main application file
(async () => {
  try {
    const dbConnection = await connectToDatabase();

    // Any other initialization tasks can be done here

    // Start your server or perform other operations that depend on the database connection
    // Example: app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during app startup:", error);
    // Gracefully handle the error and decide what to do in case of a failed database connection
  }
})();
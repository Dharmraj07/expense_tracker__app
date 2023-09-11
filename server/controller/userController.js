const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateAccessToken = async (payload) => {
  // Replace 'YOUR_SECRET_KEY' with your actual secret key for signing the token
  const secretKey = 'aso';

  // Replace 'EXPIRATION_TIME' with the desired expiration time for the token (e.g., '1h' for 1 hour)
  const expiresIn = "3600s";

  return  await jwt.sign(payload, secretKey, { expiresIn });
};

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    // const token = generateAccessToken({ user: savedUser._id });
    res.status(201).json({ message: "Successfully create new user" });

    // Return the token to the client
    // res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const loginUser = async (req, res) => {
    try {
        // const user = {
        //     id: 1,
        //     username: "mike",
        //     email: "test@gmail.com"
        //   };
        const { email, password } = req.body;
    
        // Check if the email exists in the database
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid password" });
        }
    
        
          jwt.sign({ id:user._id,isPremium:user.isPremium }, "asa", { expiresIn: '3000s' }, (err, token) => {
            res.json({ token ,id:user._id,isPremium:user.isPremium });
          });
     } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
        
     }
};

module.exports = { createUser, loginUser };

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");



// const generateAccessToken = (payload) => {
//     // Replace 'YOUR_SECRET_KEY' with your actual secret key for signing the token
//     const secretKey = 'aso';
  
//     // Replace 'EXPIRATION_TIME' with the desired expiration time for the token (e.g., '1h' for 1 hour)
//     const expiresIn = "3600s";
  
//     return jwt.sign(payload, secretKey, { expiresIn });
//   };

// const createUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check if the email is already registered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ error: "Email already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     const savedUser = await newUser.save();
//     console.log(savedUser._id);
//     // const token = generateAccessToken(savedUser);
//     res.status(201).json({ message: "Successfully create new user" });

//     // Return the token to the client
//     // res.status(201).json({ savedUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// const loginUser = async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       // Check if the email exists in the database
//       const user = await User.findOne({ email });
      
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }
//      console.log(user);
//       // Compare the provided password with the stored hashed password
//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (!passwordMatch) {
//         return res.status(401).json({ error: "Invalid password" });
//       }
  
//       // Generate and sign the JWT token with the user ID as the payload
//     //   const token = generateAccessToken({ user });
  
//     //   res.json({ message: "Login successful", token });
//     jwt.sign({ user }, "asa", { expiresIn: '3000s' }, (err, token) => {
//         res.json({ token });
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Server error" });
//     }
//   };

// module.exports = {createUser,loginUser} 
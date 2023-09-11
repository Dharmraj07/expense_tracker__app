const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function verifyToken(req, res, next) {
  const bearHeader = req.headers["authorization"];
  if (typeof bearHeader !== "undefined") {
    const bearer = bearHeader.split(" ");
    const token = bearer[1];
    req.token = token;

    try {
      const authData = await jwt.verify(req.token, "asa");
      req.authData = authData;
      
      next();
    } catch (err) {
      res.status(403).json({ result: "invalid token!" });
    }
  } else {
    res.status(401).json({
      result: "Token is not valid!"
    });
  }
}

module.exports={verifyToken};

// async function verifyToken(req, res, next) {
//   const bearHeader = req.headers["authorization"];
//   if (typeof bearHeader !== "undefined") {
//     const bearer = bearHeader.split(" ");
//     const token = bearer[1];
//     req.token = token;
//     console.log(token);
//     try {
//       const authData = await jwt.verify(req.token, "aso");
//      // req.authData = authData;
//       //next();
//       res.send(authData);
//     } catch (err) {
//       res.status(403).json({ result: "invalid token!" });
//     }
//   } else {
//     res.status(401).json({
//       result: "Token is not valid!"
//     });
//   }
// }

// module.exports={verifyToken};
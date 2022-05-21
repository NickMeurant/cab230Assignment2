const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get('/user/:email/profile', (req, res, next) => {
  const email = req.params.email;
  const token = req.headers.authorization;

  let sameEmail = false;

  if(token){
    const decoded = jwt.verify(token, "secret key");
    if(decoded.email === email){
      sameEmail = true;
    }
  }
  if(sameEmail){
    req.db.from("users").select("email","firstname","lastname","dob","address").where("email","=",email)
    .then((rows) =>{
      if(rows.length == 0){
        res.status(404).json({
          error: true,
          message: "User not found"
        })
        return;
      }
      res.send(rows);
    })
  }
  else{
    req.db.from("users").select("email","firstname","lastname").where("email","=",email)
    .then((rows) =>{
      if(rows.length == 0){
        res.status.json({
          error: true,
          message: "User not found"
        })
        return;
      }
      res.send(rows);
    })
  }
});

router.put('/user/:email/register', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;

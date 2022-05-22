const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const router = express.Router();

/* GET users listing. */
router.post('/user/register', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required"
    });
    return
  }

  const queryUsers = req.db.from("users").select("*").where("email", "=", email);
  queryUsers.then((users) => {
    if(users.length > 0) {
      res.status(409).json({
        error: true,
        message: "User already exists"
      })
      return;
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    req.db.from("users").insert({ email, hash }).then(() => {
      res.status(201).json({
        message: "User Created"
      });
    }).catch((error) =>{
      res.status(500).json({message: "Internal Error"});
    })
  }).catch((error) => {
    res.status(500).json({message: "Internal Error"});
  })
});

router.post('/user/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    res.status(400).json({
      error:true,
      message:"Request body incomplete, both email and password are required"
    })
    return
  }

  const queryUsers = req.db.from("users").select("*").where("email","=",email);
  queryUsers.then((users) =>{
    if(users.length===0){
      res.status(401).json({
        error: true,
        message: "Incorrect email or password"
      })
      res.end();
      return;
    }
    const user = users[0];
    return bcrypt.compare(password, user.hash);
  }).then((match) =>{
    if(!match){
      res.status(401).json({
        error: true,
        message: "Incorrect email or password"
      })
      res.end();
      return;
    }
    const secretKey = "secret key";
    const expires_in = 60*60*24;
    const exp = Date.now() + expires_in * 1000;
    const token = jwt.sign({email,exp},secretKey);
    res.status(200).json({
      token: token,
      token_type: "Bearer",
      expires_in: expires_in
    })
  }).catch((error) =>{
    // res.status(500).json({message: "Database Error"});
  })
});

module.exports = router;

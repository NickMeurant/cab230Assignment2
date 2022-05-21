const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

/* GET users listing. */
router.post('/user/register', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.email;

  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required"
    })
    return;
  }

  const queryUsers = req.db.from("users").select("*").where("email", "=", email);
  queryUsers.then((users) => {
    if (users.length > 0) {
      res.status(409).json({
        error: true,
        message: "User already exists"
      })
      return
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return req.db.from("users").insert({ email, hash });
  }).then(() => {
    res.status(200).json({
      message: "User Created"
    })
  }).catch((error) => {
    console.log("something went wrong " + error);
  })
});

router.post('/user/login', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;

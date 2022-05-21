const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const {authorisePutProfile, authoriseGetProfile} = require("../middlware/middleware");

/* GET users listing. */
router.get('/user/:email/profile', authoriseGetProfile, (req, res, next) => {
  const email = req.params.email;
  const token = req.headers.authorization;

  let sameEmail = false;

  if (token) {
    const decoded = jwt.verify(token, "secret key");
    if (decoded.email === email) {
      sameEmail = true;
    }
  }

  if (sameEmail) {
    req.db.from("users").select("email", "firstName", "lastName", "dob", "address").where("email", "=", email)
      .then((rows) => {
        if (rows.length == 0) {
          res.status(404).json({
            error: true,
            message: "User not found"
          })
          return;
        }
        res.send(rows);
      })
  }
  else {
    req.db.from("users").select("email", "firstName", "lastName").where("email", "=", email)
      .then((rows) => {
        if (rows.length == 0) {
          res.status(404).json({
            error: true,
            message: "User not found"
          })
          return;
        }
        res.send(rows);
      })
  }
});

router.put('/user/:email/profile', authorisePutProfile, async (req, res, next) => {
  const email = req.params.email;

  const changes = req.body;

  Object.keys(changes).forEach((item) =>{
    if(item == "firstName" || item == "lastName" || item == "dob" || item == "address"){

    }
    else{
      delete changes[item];
    }
  })

  if(Object.keys(changes).length != 4){
    res.status(400).json({
      error:true,
      message: "Request body incomplete: firstName, lastName, dob and address are required."
    })
    return;
  }

  try {
    const count = await req.db.from("users").where("email", "=", email).update(changes);
    if (count) {
      req.db.from("users").select("email", "firstName", "lastName", "dob", "address").where("email", "=", email)
        .then((rows) => {
          res.send(rows);
        });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating new post ", error: err })
  }

});

module.exports = router;

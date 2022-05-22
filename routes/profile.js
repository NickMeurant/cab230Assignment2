const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { authorisePutProfile, authoriseGetProfile , dateCheck} = require("../middlware/middleware");

/* GET users listing. */
router.get('/user/:email/profile', authoriseGetProfile, (req, res, next) => {
  const email = req.params.email;
  const authorization = req.headers.authorization;
  let token = false;

  if (authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  let sameEmail = false;

  if (authorization) {
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
        res.send(rows[0]);
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
        res.send(rows[0]);
      })
  }
});

router.put('/user/:email/profile', authorisePutProfile, async (req, res, next) => {

  const isNumeric = (num) => (typeof (num) === 'number' || typeof (num) === "string" && num.trim() !== '') && !isNaN(num);

  const email = req.params.email;

  const changes = req.body;

  if (Object.keys(changes).length < 4) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete: firstName, lastName, dob and address are required."
    })
    res.end();
    return;
  }

  for (const item in changes){ // checks they are strings
    if (isNumeric(changes[item])) {
      res.status(400).json({
        error: true,
        message: "Request body invalid: firstName, lastName and address must be strings only."
      })
      res.end();
      return;
    }
    if(changes[item] == true || changes[item] == false){
      res.status(400).json({
        error: true,
        message: "Request body invalid: firstName, lastName and address must be strings only."
      })
      res.end();
      return;
    }
  }

  Object.keys(changes).forEach((item) => { // checks everything is there
    if (!(item == "firstName" || item == "lastName" || item == "address" || item == "dob")) {
      delete changes.item;
    }
  })

  // console.log(changes);

  if (Object.keys(changes).length != 4) { //
    res.status(400).json({
      error: true,
      message: "Request body incomplete: firstName, lastName, dob and address are required."
    })
    res.end();
    return;
  }

  // data checkker implementation

  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if(changes["dob"].match(regex) === null){ // valid form
    res.status(400).json({
      error: true,
      message: "Invalid input: dob must be a real date in format YYYY-MM-DD."
    })
    res.end();
    return;
  }

  const date = new Date(changes["dob"]);

  const timestamp = date.getTime();

  if(timestamp > Date.now()){
    res.status(400).json({
      error: true,
      message: "Invalid input: dob must be a date in the past."
    })
    return;
  }

  console.log(date);
  console.log(changes["dob"]);

  if (changes["dob"].split("-")[2] != date.getDate()){ // valid 
    res.status(400).json({
      error: true,
      message: "Invalid input: dob must be a real date in format YYYY-MM-DD."
    })
    return;
  }

  try {
    const count = await req.db.from("users").where("email", "=", email).update(changes);
    if (count) {
      req.db.from("users").select("email", "firstName", "lastName", "dob", "address").where("email", "=", email)
        .then((rows) => {
          res.send(rows[0]);
        });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating new post ", error: err })
  }

});

module.exports = router;

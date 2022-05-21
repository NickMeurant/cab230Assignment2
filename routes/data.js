const express = require('express');
const router = express.Router();
const {validDistance} = require("../utils/helperfunction");

/* GET users listing. */
router.get('/countries', (req, res, next) => {
  req.db.from('data').distinct('country')
    .then((rows) => {
      let output = [];
      rows.map((value) => {
        output.push(value.country);
      })
      res.send(output);
    })
    .catch((err) => {
      console.log(err);
      res.json({ "Error": true, "Message": "Error executing MySQL query" })
    })
});

router.get('/volcanoes', (req, res, next) => {
  let country = req.query.country;
  let populatedWithin = req.query.populatedWithin;

  console.log(validDistance(populatedWithin));
  if(populatedWithin){
    if(!validDistance(populatedWithin)){
      res.json({error:"true", message: `Invalid value for populatedWithin: ${populatedWithin}. Only: 5km,10km,30km,100km are permitted.`});
      return;
    }
  }

  if (country) {
    if (populatedWithin) {
      req.db.from('data').select('*').where("country", "=", country).where("population_" + populatedWithin, ">", "0")
        .then((rows) => {
          res.send(rows);
        })
        .catch((err) => {
          console.log(err);
          res.json({ "Error": true, "Message": "Error executing MySQL query" })
        })
    }
    else {
      req.db.from('data').select('*').where("country", "=", country)
        .then((rows) => {
          res.send(rows);
        })
        .catch((err) => {
          console.log(err);
          res.json({ "Error": true, "Message": "Error executing MySQL query" })
        })
    }
  }
});

router.get('/volcano/:id', (req, res, next) => {
  let id = req.params.id;

  if(id){
    req.db.from("data").select("*").where("id", "=", id)
    .then((rows) => {
      res.send(rows);
    })
  }
});

module.exports = router;

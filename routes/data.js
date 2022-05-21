const express = require('express');
const router = express.Router();
const {validDistance} = require("../utils/helperfunction");
const {authoriseVolcano} = require("../middlware/middleware");

/* GET users listing. */
router.get('/countries', (req, res, next) => {

  if(Object.keys(req.query).length != 0){
    res.status(400).json({
      error:true,
      message:"Invalid query parameters: " + Object.keys(req.query) + " Query parameters are not permitted."
    });
    return;
  }
  req.db.from('data').distinct('country')
    .then((rows) => {
      let output = [];
      rows.map((value) => {
        output.push(value.country);
      })
      res.status(200).send(output);
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: true, 
      "Message": "Error executing MySQL query" 
    });
    })
});

router.get('/volcanoes', (req, res, next) => {
  'http://sefdb02.qut.edu.au:3002/volcanoes?country=japan&populatedWithin=5km'

  let country = req.query.country;
  let populatedWithin = req.query.populatedWithin;
  
  if(populatedWithin){
    if(!validDistance(populatedWithin)){
      res.status(400).json({error: true,
        message: `Invalid value for populatedWithin: ${populatedWithin}. Only: 5km,10km,30km,100km are permitted.`
      });
      return;
    }
  }

  if (country) {
    if (populatedWithin) {
      req.db.from('data').select('id','name','country','region','subregion').where("country", "=", country).where("population_" + populatedWithin, ">", "0")
        .then((rows) => {
          res.status(200).send(rows);
        })
        .catch((err) => {
          console.log(err);
          res.json({ "Error": true, "Message": "Error executing MySQL query" })
        })
    }
    else {
      req.db.from('data').select('id','name','country','region','subregion').where("country", "=", country)
        .then((rows) => {
          res.status.send(rows);
        })
        .catch((err) => {
          console.log(err);
          res.json({ "Error": true, "Message": "Error executing MySQL query" })
        })
    }
  }
});

router.get('/volcano/:id', authoriseVolcano, (req, res, next) => {
  const id = req.params.id;
  const token = req.headers.authorization;

  // valid jwt token
  if(id && token){
    req.db.from("data").select("*").where("id", "=", id)
    .then((rows) => {
      if(rows.length == 0){
        res.status(404).json({
          error:true,
          message:`Volcano with ID: ${id} not found.`
        })
        return;
      }
      res.send(rows);
    })
  }
  else{
    req.db.from("data").select("id","name","country","region","subregion",
    "last_eruption","summit","elevation","latitude","longitude").where("id", "=", id)
    .then((rows) => {
      if(rows.length == 0){
        res.status(404).json({
          error:true,
          message:`Volcano with ID: ${id} not found.`
        })
        return;
      }
      res.send(rows);
    })
  }
});

module.exports = router;

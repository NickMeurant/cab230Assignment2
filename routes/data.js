const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/countries', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/volcanoes', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/volcano', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;

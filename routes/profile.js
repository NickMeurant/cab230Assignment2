const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/user/:email/profile', (req, res, next) => {

});

router.put('/user/:email/register', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;

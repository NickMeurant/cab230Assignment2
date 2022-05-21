const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/me', (req, res, next) => {
  res.json({name: "Nicholas Meurant", student_number: "n10485571"});
});

module.exports = router;

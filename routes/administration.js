const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/me', (req, res, next) => {
  res.json({name: "STUDENT NAME", student_number: "STUDENT NUMBER"});
});

module.exports = router;

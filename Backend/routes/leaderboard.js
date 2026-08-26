const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', authRequired, (req, res) => {
  const leaders = db
    .prepare(
      `SELECT id, name, points,
       (SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.user_id = users.id) as quizzes_taken
       FROM users WHERE role = 'student' ORDER BY points DESC LIMIT 20`
    )
    .all();
  res.json({ leaders });
});

module.exports = router;

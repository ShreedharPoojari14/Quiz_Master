const express = require('express');
const db = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', authRequired, adminRequired, (req, res) => {
  const users = db
    .prepare(
      `SELECT id, name, email, role, points, created_at,
       (SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.user_id = users.id) as quizzes_taken
       FROM users ORDER BY created_at DESC`
    )
    .all();
  res.json({ users });
});

router.delete('/:id', authRequired, adminRequired, (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'User deleted successfully.' });
});

router.put('/:id/role', authRequired, adminRequired, (req, res) => {
  const { role } = req.body;
  if (!['student', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ message: 'Role updated successfully.' });
});

module.exports = router;

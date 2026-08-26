const express = require('express');
const db = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

// Student: own results
router.get('/mine', authRequired, (req, res) => {
  const results = db
    .prepare(
      `SELECT qa.*, c.name as category_name FROM quiz_attempts qa
       JOIN categories c ON c.id = qa.category_id
       WHERE qa.user_id = ? ORDER BY qa.created_at DESC`
    )
    .all(req.user.id);
  res.json({ results });
});

router.get('/mine/:id', authRequired, (req, res) => {
  const result = db
    .prepare(
      `SELECT qa.*, c.name as category_name FROM quiz_attempts qa
       JOIN categories c ON c.id = qa.category_id
       WHERE qa.id = ? AND qa.user_id = ?`
    )
    .get(req.params.id, req.user.id);
  if (!result) return res.status(404).json({ error: 'Result not found.' });
  res.json({ result: { ...result, answers: JSON.parse(result.answers || '[]') } });
});

// Admin: all results with optional search/filter
router.get('/', authRequired, adminRequired, (req, res) => {
  const { user, category_id } = req.query;
  let query = `SELECT qa.*, c.name as category_name, u.name as user_name, u.email as user_email
               FROM quiz_attempts qa
               JOIN categories c ON c.id = qa.category_id
               JOIN users u ON u.id = qa.user_id
               WHERE 1=1`;
  const params = [];
  if (user) {
    query += ' AND u.name LIKE ?';
    params.push(`%${user}%`);
  }
  if (category_id) {
    query += ' AND qa.category_id = ?';
    params.push(category_id);
  }
  query += ' ORDER BY qa.created_at DESC';
  const results = db.prepare(query).all(...params);
  res.json({ results });
});

module.exports = router;

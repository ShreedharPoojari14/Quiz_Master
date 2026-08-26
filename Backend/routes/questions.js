const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

// Admin: list all questions (optionally filter by category)
router.get('/', authRequired, adminRequired, (req, res) => {
  const { category_id } = req.query;
  let questions;
  if (category_id) {
    questions = db
      .prepare(
        `SELECT q.*, c.name as category_name FROM questions q
         JOIN categories c ON c.id = q.category_id
         WHERE q.category_id = ? ORDER BY q.id DESC`
      )
      .all(category_id);
  } else {
    questions = db
      .prepare(
        `SELECT q.*, c.name as category_name FROM questions q
         JOIN categories c ON c.id = q.category_id
         ORDER BY q.id DESC`
      )
      .all();
  }
  res.json({ questions });
});

const validateQuestion = [
  body('category_id').isInt().withMessage('Please select a category'),
  body('question').trim().isLength({ min: 5 }).withMessage('Question must be at least 5 characters'),
  body('option1').trim().notEmpty().withMessage('Option 1 is required'),
  body('option2').trim().notEmpty().withMessage('Option 2 is required'),
  body('option3').trim().notEmpty().withMessage('Option 3 is required'),
  body('option4').trim().notEmpty().withMessage('Option 4 is required'),
  body('correct_option').isInt({ min: 1, max: 4 }).withMessage('Select the correct option'),
];

router.post('/', authRequired, adminRequired, validateQuestion, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  const { category_id, question, option1, option2, option3, option4, correct_option } = req.body;
  const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
  if (!category) return res.status(400).json({ error: 'Selected category does not exist.' });
  const info = db
    .prepare(
      `INSERT INTO questions (category_id, question, option1, option2, option3, option4, correct_option)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(category_id, question.trim(), option1, option2, option3, option4, correct_option);
  const created = db.prepare('SELECT * FROM questions WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ question: created });
});

router.put('/:id', authRequired, adminRequired, validateQuestion, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  const existing = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Question not found.' });
  const { category_id, question, option1, option2, option3, option4, correct_option } = req.body;
  db.prepare(
    `UPDATE questions SET category_id=?, question=?, option1=?, option2=?, option3=?, option4=?, correct_option=?
     WHERE id = ?`
  ).run(category_id, question.trim(), option1, option2, option3, option4, correct_option, req.params.id);
  const updated = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  res.json({ question: updated });
});

router.delete('/:id', authRequired, adminRequired, (req, res) => {
  const existing = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Question not found.' });
  db.prepare('DELETE FROM questions WHERE id = ?').run(req.params.id);
  res.json({ message: 'Question deleted successfully.' });
});

module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', authRequired, (req, res) => {
  const lectures = db
    .prepare(
      `SELECT l.*, c.name as category_name FROM lectures l
       JOIN categories c ON c.id = l.category_id ORDER BY l.id DESC`
    )
    .all();
  const completedIds = new Set(
    db
      .prepare('SELECT lecture_id FROM lecture_progress WHERE user_id = ?')
      .all(req.user.id)
      .map((r) => r.lecture_id)
  );
  res.json({ lectures: lectures.map((l) => ({ ...l, completed: completedIds.has(l.id) })) });
});

router.post('/:id/complete', authRequired, (req, res) => {
  const lecture = db.prepare('SELECT * FROM lectures WHERE id = ?').get(req.params.id);
  if (!lecture) return res.status(404).json({ error: 'Lecture not found.' });
  const already = db
    .prepare('SELECT id FROM lecture_progress WHERE user_id = ? AND lecture_id = ?')
    .get(req.user.id, req.params.id);
  if (already) return res.json({ message: 'Already completed.', points_earned: 0 });
  db.prepare('INSERT INTO lecture_progress (user_id, lecture_id) VALUES (?, ?)').run(
    req.user.id,
    req.params.id
  );
  db.prepare('UPDATE users SET points = points + 10 WHERE id = ?').run(req.user.id);
  res.json({ message: 'Lecture marked as complete!', points_earned: 10 });
});

router.post(
  '/',
  authRequired,
  adminRequired,
  [
    body('category_id').isInt().withMessage('Select a category'),
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
    const { category_id, title, content } = req.body;
    const info = db
      .prepare('INSERT INTO lectures (category_id, title, content) VALUES (?, ?, ?)')
      .run(category_id, title.trim(), content.trim());
    const lecture = db.prepare('SELECT * FROM lectures WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ lecture });
  }
);

router.delete('/:id', authRequired, adminRequired, (req, res) => {
  const lecture = db.prepare('SELECT * FROM lectures WHERE id = ?').get(req.params.id);
  if (!lecture) return res.status(404).json({ error: 'Lecture not found.' });
  db.prepare('DELETE FROM lectures WHERE id = ?').run(req.params.id);
  res.json({ message: 'Lecture deleted successfully.' });
});

module.exports = router;

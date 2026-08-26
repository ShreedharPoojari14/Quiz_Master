const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const categories = db
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM questions q WHERE q.category_id = c.id) as question_count
       FROM categories c ORDER BY c.name ASC`
    )
    .all();
  res.json({ categories });
});

router.get('/:id', (req, res) => {
  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found.' });
  res.json({ category });
});

router.post(
  '/',
  authRequired,
  adminRequired,
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Category name must be at least 2 characters'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
    const { name, icon, description } = req.body;
    const existing = db.prepare('SELECT id FROM categories WHERE name = ?').get(name.trim());
    if (existing) return res.status(409).json({ error: 'A category with this name already exists.' });
    const info = db
      .prepare('INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)')
      .run(name.trim(), icon || '📘', description || '');
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ category });
  }
);

router.put('/:id', authRequired, adminRequired, (req, res) => {
  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found.' });
  const { name, icon, description } = req.body;
  db.prepare('UPDATE categories SET name = ?, icon = ?, description = ? WHERE id = ?').run(
    name?.trim() || category.name,
    icon ?? category.icon,
    description ?? category.description,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  res.json({ category: updated });
});

router.delete('/:id', authRequired, adminRequired, (req, res) => {
  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found.' });
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ message: 'Category deleted successfully.' });
});

module.exports = router;

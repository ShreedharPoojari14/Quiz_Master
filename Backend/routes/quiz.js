const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// GET quiz questions for a category (answers hidden), max 10 questions
router.get('/:categoryId', authRequired, (req, res) => {
  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.categoryId);
  if (!category) return res.status(404).json({ error: 'Category not found.' });

  const all = db
    .prepare('SELECT id, question, option1, option2, option3, option4 FROM questions WHERE category_id = ?')
    .all(req.params.categoryId);

  if (all.length === 0) {
    return res.status(404).json({ error: 'No questions available in this category yet.' });
  }

  const selected = shuffle(all).slice(0, Math.min(10, all.length));
  res.json({ category, questions: selected, duration_seconds: selected.length * 60 });
});

// POST submit quiz answers { category_id, answers: { [question_id]: option_number|null } }
router.post(
  '/submit',
  authRequired,
  [
    body('category_id').isInt().withMessage('Category is required'),
    body('answers').isObject().withMessage('Answers are required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { category_id, answers } = req.body;
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(category_id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });

    const questionIds = Object.keys(answers);
    if (questionIds.length === 0) {
      return res.status(400).json({ error: 'No answers submitted.' });
    }

    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const detailedAnswers = [];

    for (const qid of questionIds) {
      const q = db.prepare('SELECT * FROM questions WHERE id = ?').get(qid);
      if (!q) continue;
      const selected = answers[qid];
      const isCorrect = selected != null && Number(selected) === q.correct_option;
      if (selected == null) skipped++;
      else if (isCorrect) correct++;
      else wrong++;
      detailedAnswers.push({
        question_id: q.id,
        question: q.question,
        options: [q.option1, q.option2, q.option3, q.option4],
        correct_option: q.correct_option,
        selected_option: selected != null ? Number(selected) : null,
        is_correct: isCorrect,
      });
    }

    const total = questionIds.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const pointsEarned = correct * 10;

    const info = db
      .prepare(
        `INSERT INTO quiz_attempts
         (user_id, category_id, score, total, correct_count, wrong_count, skipped_count, percentage, points_earned, answers)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        req.user.id,
        category_id,
        correct,
        total,
        correct,
        wrong,
        skipped,
        percentage,
        pointsEarned,
        JSON.stringify(detailedAnswers)
      );

    db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(pointsEarned, req.user.id);

    const attempt = db.prepare('SELECT * FROM quiz_attempts WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({
      attempt: {
        ...attempt,
        answers: detailedAnswers,
        category_name: category.name,
      },
      points_earned: pointsEarned,
    });
  }
);

module.exports = router;

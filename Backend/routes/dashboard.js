const express = require('express');
const db = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

function levelInfo(points) {
  const level = Math.floor(points / 100) + 1;
  const pointsIntoLevel = points % 100;
  const pointsToNextLevel = 100 - pointsIntoLevel;
  let badge = 'Bronze';
  if (points >= 500) badge = 'Platinum';
  else if (points >= 250) badge = 'Gold';
  else if (points >= 100) badge = 'Silver';
  return { level, pointsIntoLevel, pointsToNextLevel, badge };
}

router.get('/student', authRequired, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const stats = db
    .prepare(
      `SELECT COUNT(*) as quizzes_attempted,
              COALESCE(AVG(percentage), 0) as average_score,
              COALESCE(MAX(percentage), 0) as best_score
       FROM quiz_attempts WHERE user_id = ?`
    )
    .get(req.user.id);
  const recent = db
    .prepare(
      `SELECT qa.*, c.name as category_name FROM quiz_attempts qa
       JOIN categories c ON c.id = qa.category_id
       WHERE qa.user_id = ? ORDER BY qa.created_at DESC LIMIT 5`
    )
    .all(req.user.id);
  const lecturesCompleted = db
    .prepare('SELECT COUNT(*) as c FROM lecture_progress WHERE user_id = ?')
    .get(req.user.id).c;

  res.json({
    stats: {
      quizzes_attempted: stats.quizzes_attempted,
      average_score: Math.round(stats.average_score),
      best_score: Math.round(stats.best_score),
      points: user.points,
      lectures_completed: lecturesCompleted,
      ...levelInfo(user.points),
    },
    recent_results: recent,
  });
});

router.get('/admin', authRequired, adminRequired, (req, res) => {
  const totalQuestions = db.prepare('SELECT COUNT(*) as c FROM questions').get().c;
  const totalUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'student'").get().c;
  const totalCategories = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
  const totalResults = db.prepare('SELECT COUNT(*) as c FROM quiz_attempts').get().c;
  const recentResults = db
    .prepare(
      `SELECT qa.*, c.name as category_name, u.name as user_name FROM quiz_attempts qa
       JOIN categories c ON c.id = qa.category_id
       JOIN users u ON u.id = qa.user_id
       ORDER BY qa.created_at DESC LIMIT 5`
    )
    .all();

  res.json({
    stats: {
      total_questions: totalQuestions,
      total_users: totalUsers,
      total_categories: totalCategories,
      total_results: totalResults,
    },
    recent_results: recentResults,
  });
});

module.exports = router;

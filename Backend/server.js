require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./db'); // initializes & seeds the database

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const questionRoutes = require('./routes/questions');
const quizRoutes = require('./routes/quiz');
const resultRoutes = require('./routes/results');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const contactRoutes = require('./routes/contact');
const leaderboardRoutes = require('./routes/leaderboard');
const lectureRoutes = require('./routes/lectures');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/lectures', lectureRoutes);

// 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server. Please try again.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`QuizMaster API running on http://localhost:${PORT}`);
});

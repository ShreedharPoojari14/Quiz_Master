const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(path.join(__dirname, 'data', 'quizmaster.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  points INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT '📘',
  description TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  option1 TEXT NOT NULL,
  option2 TEXT NOT NULL,
  option3 TEXT NOT NULL,
  option4 TEXT NOT NULL,
  correct_option INTEGER NOT NULL CHECK (correct_option BETWEEN 1 AND 4),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lectures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lecture_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lecture_id INTEGER NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  completed_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, lecture_id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  correct_count INTEGER NOT NULL DEFAULT 0,
  wrong_count INTEGER NOT NULL DEFAULT 0,
  skipped_count INTEGER NOT NULL DEFAULT 0,
  percentage REAL NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  answers TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

// Seed data only if empty
const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
if (userCount === 0) {
  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password_hash, role, points) VALUES (?, ?, ?, ?, ?)'
  );
  insertUser.run('Admin User', 'admin@quizmaster.com', bcrypt.hashSync('admin123', 10), 'admin', 0);
  insertUser.run('John Doe', 'john@quizmaster.com', bcrypt.hashSync('student123', 10), 'student', 240);
  insertUser.run('Jane Smith', 'jane@quizmaster.com', bcrypt.hashSync('student123', 10), 'student', 180);

  const insertCat = db.prepare(
    'INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)'
  );
  const cats = [
    ['General Knowledge', '💡', 'Test your general awareness'],
    ['Computer Science', '💻', 'Programming, hardware & software'],
    ['Science', '🧪', 'Physics, Chemistry & Biology'],
    ['Sports', '🏆', 'Sports facts and trivia'],
    ['History', '🏛️', 'World history and events'],
    ['Geography', '🌍', 'Countries, capitals & maps'],
  ];
  const catIds = {};
  for (const [name, icon, description] of cats) {
    const info = insertCat.run(name, icon, description);
    catIds[name] = info.lastInsertRowid;
  }

  const insertQ = db.prepare(`INSERT INTO questions
    (category_id, question, option1, option2, option3, option4, correct_option)
    VALUES (?, ?, ?, ?, ?, ?, ?)`);

  const questions = {
    'Computer Science': [
      ['What does HTML stand for?', 'Hyper Text Markup Language', 'High Text Machine Language', 'Hyperlinks and Text Markup Language', 'Home Tool Markup Language', 1],
      ['Which programming language is known as the "father of all languages"?', 'Python', 'C', 'Java', 'C++', 2],
      ['What does CPU stand for?', 'Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Processor Utility', 2],
      ['Which of these is not a programming language?', 'Python', 'Java', 'HTTP', 'Ruby', 3],
      ['What does SQL stand for?', 'Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Sequential Query Language', 1],
      ['Which company developed React?', 'Google', 'Facebook (Meta)', 'Microsoft', 'Amazon', 2],
      ['What is the binary equivalent of decimal 10?', '1010', '1100', '1001', '1110', 1],
      ['Which data structure uses FIFO?', 'Stack', 'Queue', 'Tree', 'Graph', 2],
      ['What does RAM stand for?', 'Random Access Memory', 'Read Access Memory', 'Run Access Memory', 'Random Active Memory', 1],
      ['Which symbol is used for comments in Python?', '//', '#', '<!-- -->', '/* */', 2],
    ],
    'General Knowledge': [
      ['What is the capital of Japan?', 'Seoul', 'Beijing', 'Tokyo', 'Bangkok', 3],
      ['How many continents are there?', '5', '6', '7', '8', 3],
      ['Who wrote the play "Romeo and Juliet"?', 'Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen', 2],
      ['What is the largest ocean on Earth?', 'Atlantic', 'Indian', 'Arctic', 'Pacific', 4],
      ['Which is the smallest prime number?', '0', '1', '2', '3', 3],
    ],
    'Science': [
      ['What is the chemical symbol for water?', 'H2O', 'CO2', 'O2', 'NaCl', 1],
      ['What planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 2],
      ['What gas do plants absorb from the atmosphere?', 'Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen', 3],
      ['What is the powerhouse of the cell?', 'Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body', 3],
      ['What force keeps us on the ground?', 'Magnetism', 'Gravity', 'Friction', 'Tension', 2],
    ],
    'Sports': [
      ['How many players are there in a football team on the field?', '9', '10', '11', '12', 3],
      ['In which sport would you perform a slam dunk?', 'Volleyball', 'Basketball', 'Tennis', 'Baseball', 2],
      ['How often are the Summer Olympic Games held?', 'Every 2 years', 'Every 4 years', 'Every 5 years', 'Every 3 years', 2],
    ],
    'History': [
      ['In which year did World War II end?', '1943', '1945', '1948', '1950', 2],
      ['Who was the first President of the United States?', 'Abraham Lincoln', 'Thomas Jefferson', 'George Washington', 'John Adams', 3],
      ['The Great Wall is located in which country?', 'India', 'China', 'Japan', 'Mongolia', 2],
    ],
    'Geography': [
      ['Which is the longest river in the world?', 'Amazon', 'Nile', 'Yangtze', 'Mississippi', 2],
      ['Mount Everest is located in which mountain range?', 'Andes', 'Alps', 'Himalayas', 'Rockies', 3],
      ['Which country has the largest population?', 'USA', 'India', 'China', 'Indonesia', 3],
    ],
  };

  for (const [catName, qs] of Object.entries(questions)) {
    const catId = catIds[catName];
    for (const q of qs) {
      insertQ.run(catId, ...q);
    }
  }

  const insertLec = db.prepare(`INSERT INTO lectures (category_id, title, content) VALUES (?, ?, ?)`);
  insertLec.run(catIds['Computer Science'], 'Introduction to Programming', 'Programming is the process of giving instructions to a computer to perform a task. Languages like Python, Java, and C++ let developers write code that computers can execute. Understanding variables, loops, and functions is the foundation of all software development.');
  insertLec.run(catIds['Computer Science'], 'Understanding the Web', 'The web works through HTML for structure, CSS for styling, and JavaScript for interactivity. Browsers request pages from servers using HTTP, and servers respond with the content needed to render a page.');
  insertLec.run(catIds['Science'], 'The Solar System', 'Our solar system consists of the Sun and everything that orbits it, including eight planets, dwarf planets, moons, asteroids, and comets. Earth is the third planet from the Sun and the only one known to support life.');
  insertLec.run(catIds['General Knowledge'], 'World Capitals', 'Every country has a capital city, usually the seat of government. Knowing world capitals is a great way to build general knowledge and geographic awareness.');

  // Sample quiz attempts for John Doe
  const johnId = db.prepare("SELECT id FROM users WHERE email = 'john@quizmaster.com'").get().id;
  const csId = catIds['Computer Science'];
  const gkId = catIds['General Knowledge'];
  const sciId = catIds['Science'];
  const insertAttempt = db.prepare(`INSERT INTO quiz_attempts
    (user_id, category_id, score, total, correct_count, wrong_count, skipped_count, percentage, points_earned, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insertAttempt.run(johnId, csId, 8, 10, 8, 2, 0, 80, 80, '2024-05-12 10:00:00');
  insertAttempt.run(johnId, gkId, 7, 10, 7, 3, 0, 70, 70, '2024-05-10 10:00:00');
  insertAttempt.run(johnId, sciId, 9, 10, 9, 1, 0, 90, 90, '2024-05-08 10:00:00');
}

module.exports = db;

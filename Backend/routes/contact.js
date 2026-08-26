const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Please enter your name'),
    body('email').trim().isEmail().withMessage('Please enter a valid email'),
    body('message').trim().isLength({ min: 5 }).withMessage('Message is too short'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
    const { name, email, message } = req.body;
    db.prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)').run(
      name.trim(),
      email.trim(),
      message.trim()
    );
    res.status(201).json({ message: 'Thanks for reaching out! We will get back to you soon.' });
  }
);

module.exports = router;

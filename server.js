const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
};
app.use(cors(corsOptions));
app.use(express.json());

// Get all messages
app.get('/api/messages', (req, res) => {
  db.all('SELECT * FROM messages ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Post a new message
app.post('/api/messages', (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    res.status(400).json({ error: 'Text cannot be empty' });
    return;
  }
  
  db.run('INSERT INTO messages (text) VALUES (?)', [text], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.get('SELECT * FROM messages WHERE id = ?', [this.lastID], (err, row) => {
       res.status(201).json(row);
    });
  });
});

// Like a message
app.post('/api/messages/:id/like', (req, res) => {
  const id = req.params.id;
  db.run('UPDATE messages SET likes = likes + 1 WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }
    db.get('SELECT * FROM messages WHERE id = ?', [id], (err, row) => {
       res.json(row);
    });
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

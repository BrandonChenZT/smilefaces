const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'brandy',
  password: '123456',
  database: 'message_board_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express();
app.use(bodyParser.json());

// 处理留言提交
app.post('/api/messages', async (req, res) => {
  try {
    const [insertResult] = await pool.query(
      'INSERT INTO messages (content) VALUES (?, ?)',
      [req.body.content]
    );

    // 假设日期字段由数据库自动填充
    const insertedMessage = { id: insertResult.insertId, content: req.body.content };

    res.status(201).json(insertedMessage);
  } catch (error) {
    res.status(500).json({ error: '提交留言时发生错误' });
  }
});

// 获取留言列表
app.get('/api/messages', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM messages ORDER BY date DESC');
    res.json(rows.map(row => ({ id: row.id, content: row.content, date: row.date })));
  } catch (error) {
    res.status(500).json({ error: '获取留言列表时发生错误' });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
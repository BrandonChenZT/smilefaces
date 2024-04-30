const express = require('express');
const mysql = require('mysql2');

// 创建Express应用
const app = express();
app.use(express.json()); // 用于解析JSON格式的请求体

// 配置数据库连接
const pool = mysql.createPool({
  host: 'localhost',
  user: 'brandy',
  password: '123456',
  database: 'smileface_user_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 假设前端发送的数据包含用户名和分数
app.post('/api/submit-test-result', async (req, res) => {
  try {
    const { username, score } = req.body;

    // 将数据插入到数据库的users_test_results表中
    const [result] = await pool.query(
      'INSERT INTO test_results (username, score) VALUES (?, ?)',
      [username, score]
    );

    res.status(201).json({ message: 'Data saved successfully', id: result.insertId });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});


// 启动服务器
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
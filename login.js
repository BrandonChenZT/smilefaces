// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise'); 
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const pool = mysql.createPool({
  host: 'localhost',
  user: 'brandy',
  password: '123456',
  database: 'smileface_user_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0, 
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 查询数据库，使用预编译查询语句
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: '邮箱或密码不正确' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: '邮箱或密码不正确' });
    }

    // 生成Token，注意密钥应当来自环境变量或其他安全存储
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; // 建议从环境变量获取
    const token = jwt.sign({ userId: rows[0].id }, jwtSecret, { expiresIn: '1h' });

    res.json({ token, email: rows[0].email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 启动服务器，确保环境变量已经正确设置
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// 引入必要的库
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

// 创建Express应用实例
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 创建MySQL连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'brandy',
  password: '123456',
  database: 'smileface_user_db'
});
connection.connect((err) => {
  if (err) throw err;
});

// 注册路由处理
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    // 前端验证后到达这里的假设已经满足一致性和格式要求
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // 检查邮箱是否已存在
    const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
    const emailExists = await new Promise((resolve, reject) => {
      connection.query(checkEmailSql, [email], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.length > 0);
      });
    });

    if (emailExists) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // 对密码进行哈希处理
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 插入新用户到数据库
    const insertUserSql = 'INSERT INTO users (email, password_hash) VALUES (?, ?)';
    await new Promise((resolve, reject) => {
      connection.query(insertUserSql, [email, hashedPassword], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

// 启动服务器监听指定端口
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
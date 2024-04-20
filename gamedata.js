// 导入所需的模块
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql'); // 或者使用其他MySQL驱动，如mysql2

// 创建Express应用
const app = express();
app.use(bodyParser.json());

// 建立数据库连接（这里使用MySQL）
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'brandy',
    password: '123456',
    database: 'smileface_user_db',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

// 定义接收游戏数据的路由
app.post('/api/submit-game-data', (req, res) => {
    const gameData = req.body;

    const sql = `
        INSERT INTO games (user_id, level, time_played, correct_guesses, incorrect_guesses, accuracy)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        gameData.userId,
        gameData.level,
        gameData.timePlayed,
        gameData.correctGuesses,
        gameData.incorrectGuesses,
        gameData.accuracy,
    ];

    connection.query(sql, values, (error) => {
        if (error) {
            console.error('Error saving game data to the database:', error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Game data saved successfully to the database.');
            res.status(200).send('Game data received successfully!');
        }
    });
});

// 启动Express服务器
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
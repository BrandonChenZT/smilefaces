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

app.get('/api/user-game-data/:userEmail', (req, res) => {
    const userEmail = req.params.userEmail;

    const sql = 'SELECT * FROM games WHERE user_id = ?';
    const value = [userEmail];

    connection.query(sql, value, (error, results) => {
        if (error) {
            console.error('Error retrieving game data from the database:', error);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                console.log('User game data retrieved successfully from the database.');
                res.status(200).json(results);
            } else {
                res.status(404).send('No game data found for the specified user.');
            }
        }
    });
});

app.get('/api/user-game-data', async (req, res) => {
    try {
      const { userId, limit = 10 } = req.query;
      const whereClause = { userId: userId };
      
      const recentGameData = await UserGame.findAll({
        where: whereClause,
        order: [['played_at', 'DESC']],
        limit: parseInt(limit, 10),
      });
  
      if (recentGameData.length === 0) {
        return res.status(404).json({ message: 'No game data found for the given user' });
      }
  
      res.json(recentGameData);
    } catch (error) {
      console.error('Error fetching recent game data:', error);
      res.status(500).json({ error: 'Failed to fetch recent game data' });
    }
  });
  
  // ...

// 启动Express服务器
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
document.addEventListener('DOMContentLoaded', function() {
    var quizContainer = document.getElementById('quiz');
    var quizAnswerInput = document.getElementById('quiz-answer');
    var submitQuizAnswerButton = document.getElementById('submit-quiz-answer');
    var messageElem = document.getElementById('message');
    var gameContainer = document.getElementById('game-container');

    // 初始状态，测试问题可见，游戏容器隐藏
    quizContainer.style.display = 'block';
    gameContainer.style.display = 'none'; // 确保游戏容器初始为隐藏状态

    // 提交答案按钮的点击事件
    submitQuizAnswerButton.addEventListener('click', function() {
        var userAnswer = quizAnswerInput.value.trim(); // 获取用户输入的答案并去除空白字符
        var correctAnswer = '2'; // 预设的正确答案

        // 隐藏测试问题界面
        quizContainer.style.display = 'none';

        // 根据用户答案显示相应的消息
        if (userAnswer === correctAnswer) {
            messageElem.textContent = '回答正确，您可以玩一玩这个游戏。';
        } else {
            messageElem.textContent = '回答错误，您非常需要玩这个游戏。';
        }
        messageElem.style.display = 'block'; // 显示消息

        // 启动游戏逻辑
        startGame();
    });

    // 假设这是您的startGame函数，需要根据实际情况进行调整
    function startGame() {
        if (countdownIntervalId) {
            clearInterval(countdownIntervalId);
        }
        container.innerHTML = ''; // 清空容器
        correctGuesses = 0; // 重置笑脸次数
        const smileyFace = selectSmileyFace(); // 随机选择一个笑脸
        // 获取所选等级
        const level = parseInt(document.getElementById('level-select').value);
    
        // 更新游戏容器的CSS样式以适应所选等级的网格布局
        container.style.gridTemplateColumns = `repeat(${level}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${level}, 1fr)`;
        initGame(); // 初始化游戏
        startTime = performance.now(); // 记录游戏开始时间
        displayTimer(); // 显示倒计时
        messageElem.style.display = 'none'; // 隐藏消息提示
        startButton.style.display = 'none'; // 隐藏开始按钮
        // 显示游戏容器
        gameContainer.style.display = 'block';
        // 隐藏消息提示，如果需要的话
        messageElem.style.display = 'none';
    }
});
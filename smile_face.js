const container = document.getElementById('game-container');
const messageElem = document.getElementById('message');
const timerDisplay = document.getElementById('timer');
let faces = [];
let smileyFaceIndexInArray = -1; // 记录笑脸在faces数组中的索引
let startTime = null;
let correctGuesses = 0;
let incorrectGuesses = 0;
const countdownTime = 120;
let countdownIntervalId = null;
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);
let levelUnlocks = {
    level2: false,
    level3: false,
    };

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
    initGame(level); // 初始化游戏
    updateUnlockUI();
    startTime = performance.now(); // 记录游戏开始时间
    displayTimer(); // 显示倒计时
    messageElem.style.display = 'none'; // 隐藏消息提示
    startButton.style.display = 'none'; // 隐藏开始按钮
}

function selectSmileyFace() {
    var smileyFaces = [];
// 设置起始和结束编号
    var startNumber = 1;
    var endNumber = 2162;
// 循环遍历起始到结束编号
    for (var i = startNumber; i <= endNumber; i++) {
  // 为了保持四位数格式，在数字前补零
    var paddedNumber = ("000" + i).slice(-4); // 如果i小于1000，则会自动补足前面的零
    var fileName = "file" + paddedNumber + ".jpg";
  
  // 将生成的文件名添加到数组中
    smileyFaces.push(fileName);
    }
    const randomIndex = Math.floor(Math.random() * smileyFaces.length);
    return 'files/' + smileyFaces[randomIndex];
}

function initGame(level = parseInt(document.getElementById('level-select').value)){
    faces = [];
    smileyFaceIndexInArray = getRandomInt(0, level*level-1);
    const numberOfFaces = level * level;
    const usedFaces = new Set(); // 用于跟踪已经使用过的图片
    // 随机选择一个笑脸图片
    const smileyFaceSrc = selectSmileyFace();
    usedFaces.add(smileyFaceSrc); // 记录已选择的笑脸图片
    var nonSmileyFaces = [];
    var startNumber = 2163;
    var endNumber = 4000;
    for(var i = startNumber; i <= endNumber; i++) {
        var paddedNumber = ("000" + i).slice(-4);
        var fileName = "file" + paddedNumber + ".jpg";
        nonSmileyFaces.push(fileName);
    }
    nonSmileyFaces.splice(nonSmileyFaces.indexOf(smileyFaceSrc), 1); // 确保笑脸图片不会出现在非笑脸列表中
    for (let i = 0; i < numberOfFaces; i++) {
        let faceSrc;
        let isSmiley = false;
        if (i === smileyFaceIndexInArray) {
            // 放置笑脸
            faceSrc = smileyFaceSrc;
            isSmiley = true;
            smileyFaceIndexInArray = i; // 记录笑脸的位置
        } else {
            // 随机选择一个未使用过的非笑脸图片
            let nonSmileyFaceSrc = '';
            do {
                const randomIndex = Math.floor(Math.random() * nonSmileyFaces.length);
                nonSmileyFaceSrc = 'notsmile/' + nonSmileyFaces[randomIndex];
            } while (usedFaces.has(nonSmileyFaceSrc)); // 确保不重复使用图片
            usedFaces.add(nonSmileyFaceSrc); // 记录已选择的非笑脸图片
            faceSrc = nonSmileyFaceSrc;
        }
        // 创建图片元素并添加到容器中
        const face = document.createElement('img');
        face.classList.add('face');
        face.src = faceSrc;
        face.index = i; // 为图片元素添加索引属性
        if (isSmiley) {
            faces[i] = { img: face, isSmiley: true, index: i };
        } else {
            faces.push({ img: face, isSmiley: false, index: i });
        }
        container.appendChild(face);
        face.addEventListener('click', handleClick);
    }
        const isLevel1 = level === 1;
        const meetsAccuracyRequirement = accuracy >= 90;
        const meetsCorrectGuessesRequirement = correctGuesses >= 20;

        if (isLevel1 && meetsAccuracyRequirement && meetsCorrectGuessesRequirement) {
            levelUnlocks.level2 = true;
            levelUnlocks.level3 = true;
    }
}

function displayTimer() {
    let remainingTime = countdownTime;
    countdownIntervalId = setInterval(() => {
        remainingTime--;
        timerDisplay.textContent = remainingTime.toString().padStart(2, '0');
        if (remainingTime <= 0) {
            clearInterval(countdownIntervalId);
            timerDisplay.textContent = '00';
            finishGame(); // 游戏结束
            updateUnlockUI();
        }
    }, 1000);
}

function updateUnlockUI() {
    const levelSelect = document.getElementById('level-select');
  
    // 遍历levelSelect的选项，根据levelUnlocks状态禁用或启用选项
    for (const option of levelSelect.options) {
      const levelNumber = parseInt(option.value, 10);
      if (levelNumber === 2 || levelNumber === 3) {
        option.disabled = !levelUnlocks[`level${levelNumber}`];
      }
    }
  }

function handleClick(event) {
    const clickedFace = event.target;
    const clickedFaceIndex = clickedFace.index; // 通过索引属性获取被点击图片的索引
    if (clickedFaceIndex >= 0 && clickedFaceIndex < faces.length) { // 确保索引有效
        const face = faces[clickedFaceIndex];
        if (face.isSmiley) {
            correctGuesses++;
            messageElem.textContent = '恭喜你，找到了笑脸！';
            refreshFaces();
        } else {
            incorrectGuesses++;
            messageElem.textContent = '很遗憾，这不是笑脸。';
        }
        messageElem.style.display = 'block';
        messageUpdated = true;
    }
}
function refreshFaces() {
    faces.forEach(face => {
        container.removeChild(face.img); // 移除所有图片
    });
    faces = [];
    smileyFaceIndexInArray = -1; // 重置笑脸索引
    initGame(); // 重新初始化游戏
}

function finishGame() {
    clearInterval(countdownIntervalId); // 停止倒计时
    container.innerHTML = ''; // 清空图片
    const totalAttempts = correctGuesses + incorrectGuesses; // 总尝试次数
    const accuracy = Math.round((correctGuesses / totalAttempts) * 100); // 计算正确率

    // 检查是否满足解锁条件
    const isLevel1 = level === 1;
    const meetsAccuracyRequirement = accuracy >= 90;
    const meetsCorrectGuessesRequirement = correctGuesses >= 20;

    if (isLevel1 && meetsAccuracyRequirement && meetsCorrectGuessesRequirement) {
        levelUnlocks.level2 = true;
        levelUnlocks.level3 = true;
    }

    messageElem.textContent = `时间到！你共尝试了 ${totalAttempts} 次，正确率为 ${accuracy}%。你找到了 ${correctGuesses} 次笑脸。'`;
    messageElem.style.display = 'block';
    startButton.style.display = 'block'; // 显示开始按钮
    const level = parseInt(document.getElementById('level-select').value);
    const userEmail = localStorage.getItem('email');
    const gameData = {
        userId: userEmail,
        level: level,
        timePlayed: countdownTime,
        correctGuesses: correctGuesses,
        incorrectGuesses: incorrectGuesses,
        accuracy: accuracy,
    };
    sendGameDataToServer(gameData);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendGameDataToServer(gameData) {
    const url = '/api/submit-game-data';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('Game data submitted successfully:', data);
            // 处理成功的回调操作
        })
        .catch(error => {
            console.error('Error submitting game data:', error);
            // 处理错误的回调操作
        });
}


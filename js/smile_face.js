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
}
function selectSmileyFace() {
    // 假设笑脸图片的文件名以 "_smile" 结尾
    // const smileyFaces = ['smileface/face1_smile.jpg', 'smileface/face2_smile.jpg', 'smileface/face3_smile.jpg', 
    // 'smileface/face4_smile.jpg', 'smileface/face5_smile.jpg'];
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
function initGame(level = parseInt(document.getElementById('level-select').value)) {
    faces = [];
    smileyFaceIndexInArray = getRandomInt(0, level*level-1);
    const numberOfFaces = level * level;
    const usedFaces = new Set(); // 用于跟踪已经使用过的图片
    // 随机选择一个笑脸图片
    const smileyFaceSrc = selectSmileyFace();
    usedFaces.add(smileyFaceSrc); // 记录已选择的笑脸图片
    // 移除笑脸图片，以便从非笑脸图片中随机选择
    // const nonSmileyFaces = ['face1.jpg', 'face2.jpg', 'face3.jpg', 'face4.jpg', 'face5.jpg', 'face6.jpg', 'face7.jpg', 'face8.jpg', 'face9.jpg', 'face10.jpg',
    //                     'face11.jpg', 'face16.jpg', 'face17.jpg', 'face22.jpg', 'face23.jpg', 'face28.jpg',
    //                     'face12.jpg', 'face15.jpg', 'face18.jpg', 'face21.jpg', 'face24.jpg', 'face27.jpg',
    //                     'face13.jpg', 'face14.jpg', 'face19.jpg', 'face20.jpg', 'face25.jpg', 'face26.jpg'];
    var nonSmileyFaces = [];
    var startNumber = 2163;
    var endNumber = 4000;
    for(var i = startNumber; i <= endNumber; i++) {
        var paddedNumber = ("000" + i).slice(-4);
        var fileName = "file" + paddedNumber + ".jpg";
        nonSmileyFaces.push(fileName);
    }
    // console.log(nonSmileyFaces);
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
        }
    }, 1000);
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
    messageElem.textContent = `时间到！你共尝试了 ${totalAttempts} 次，正确率为 ${accuracy}%。  
    你找到了 ${correctGuesses} 次笑脸。'`;
    messageElem.style.display = 'block';
    startButton.style.display = 'block'; // 显示开始按钮
    const level = parseInt(document.getElementById('level-select').value);
    const userEmail = localStorage.getItem('email');
    const gameData = {
    user_id: userEmail,
    level: level,
    time_played: countdownTime,
    correct_guesses: correctGuesses,
    incorrect_guesses: incorrectGuesses,
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


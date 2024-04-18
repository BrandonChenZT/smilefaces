const container = document.getElementById('game-container');
const messageElem = document.getElementById('message');
const timerDisplay = document.getElementById('timer');
let faces = [];
let smileyFaceIndexInArray = -1;
let startTime = null;
let smileyCount = 0;
const countdownTime = 120;
let countdownIntervalId = null;
const levels = [3, 4, 5]; // 可用的等级
let currentLevel = levels[0]; // 默认等级

const startButton = document.getElementById('start-button');
const levelSelect = document.getElementById('level-select');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startGame() { // 移除 level 参数，使用 currentLevel
    if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
    }
    container.innerHTML = ''; // 清空容器
    smileyCount = 0; // 重置笑脸次数
    initGame(currentLevel); // 使用 currentLevel 初始化游戏
    startTime = performance.now(); // 记录游戏开始时间
    displayTimer(); // 显示倒计时
    messageElem.style.display = 'none'; // 隐藏消息提示
    startButton.style.display = 'none'; // 隐藏开始按钮
}

// 设置等级选择的默认值和事件监听器
levelSelect.value = currentLevel;
levelSelect.addEventListener('change', (event) => {
    currentLevel = parseInt(event.target.value);
    // 当等级改变时，重新开始游戏
    startGame();
});

// 为开始按钮添加点击事件监听器
startButton.addEventListener('click', startGame); // 直接调用 startGame


function initGame(level) {
    faces = [];
    smileyFaceIndexInArray = -1; // 重置笑脸索引
    const smileyFaceCount = { 3: 1, 4: 4, 5: 9 }[level]; // 根据等级获取笑脸数量
    const totalFaces = level * level; // 计算总面孔数
    const nonSmileyFaceCount = totalFaces - smileyFaceCount; // 计算非笑脸数量

    let usedFaces = new Set(); // 用于跟踪已经使用过的图片

    // 随机选择相应数量的笑脸图片
    const smileyFaces = [];
    for (let i = 0; i < smileyFaceCount; i++) {
        const smileyFaceSrc = selectSmileyFace();
        smileyFaces.push(smileyFaceSrc);
        usedFaces.add(smileyFaceSrc);
    }

    // 随机选择相应数量的非笑脸图片
    const nonSmileyFaces = generateNonSmileyFaces(nonSmileyFaceCount);

    // 创建并添加图片到容器
    for (let i = 0; i < totalFaces; i++) {
        let faceSrc;
        let isSmiley = false;
        if (smileyFaces.length > 0) {
            faceSrc = smileyFaces.pop(); // 使用一个未使用的笑脸图片
            isSmiley = true;
        } else {
            faceSrc = nonSmileyFaces.pop(); // 使用一个未使用的非笑脸图片
        }

        const face = document.createElement('img');
        face.classList.add('face');
        face.src = faceSrc;
        face.index = i;
        face.addEventListener('click', handleClick);
        faces.push({ img: face, isSmiley: isSmiley, index: i });
        container.appendChild(face);
    }
}

function selectSmileyFace() {
    let smileyFaces = []; 
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

function generateNonSmileyFaces(count) {
    let nonSmileyFaces = [];
    for (let i = 2163; i <= 4000; i++) {
        const paddedNumber = ("000" + i).slice(-4);
        const fileName = "notsmile/file" + paddedNumber + ".jpg";
        nonSmileyFaces.push(fileName);
    }
    // 随机化数组顺序
    nonSmileyFaces = nonSmileyFaces.sort(() => Math.random() - 0.5);
    // 返回所需数量的图片路径
    return nonSmileyFaces.slice(0, count);
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
    const clickedFaceIndex = clickedFace.index;
    const face = faces[clickedFaceIndex];

    if (face.isSmiley) {
        smileyCount++; // 更新笑脸点击次数
        messageElem.textContent = '恭喜你，找到了笑脸！';
    } else {
        messageElem.textContent = '很遗憾，这不是笑脸。';
    }

    messageElem.style.display = 'block';
    setTimeout(() => {
        messageElem.style.display = 'none';
        // 如果点击的是笑脸，刷新图片
        if (face.isSmiley) {
            refreshFaces();
        }
    }, 2000);
}

function refreshFaces() {
    faces.forEach(face => {
        container.removeChild(face.img); // 移除所有图片
    });
    faces = [];
    smileyFaceIndexInArray = -1; // 重置笑脸索引
    // 重新初始化游戏，使用当前等级
    initGame(currentLevel);
}

function finishGame() {
    clearInterval(countdownIntervalId); // 停止倒计时
    container.innerHTML = ''; // 清空图片
    // 假设 correctGuesses 和 incorrectGuesses 是在游戏逻辑中定义的
    const totalAttempts = correctGuesses + incorrectGuesses; // 总尝试次数
    const accuracy = Math.round((correctGuesses / totalAttempts) * 100); // 计算正确率
    messageElem.textContent = `时间到！你共尝试了 ${totalAttempts} 次，正确率为 ${accuracy}%。你找到了 ${correctGuesses} 次笑脸。`;
    messageElem.style.display = 'block';
    startButton.style.display = 'block'; // 显示开始按钮
}

// 假设用户ID已存储在localStorage中
const userId = localStorage.getItem('email');
async function fetchRecentGameData(userId) {
    const response = await fetch(`/api/user-game-data/?userId=${userId}&limit=10`);
    if (!response.ok) {
        throw new Error('Failed to fetch recent game data');
    }
    return response.json();
}
async function calculateProgress(recentGameData) {
    let totalCorrectGuesses = 0;
    let totalGames = 0;
    let totalAccuracy = 0;
    recentGameData.forEach(game => {
        totalCorrectGuesses += game.correct_guesses;
        totalAccuracy += game.accuracy * game.correct_guesses;
        totalGames += 1;
    });
    const averageAccuracy = totalGames > 0 ? totalAccuracy / totalGames : 0;
    const maxCorrectGuesses = Math.max(...recentGameData.map(game => game.correct_guesses));
    return {
        maxCorrectGuesses,
        averageAccuracy,
    };
}
async function updateLevelSelectAndCheckUnlock() {
    try {
        const recentGameData = await fetchRecentGameData(userId);
        const progress = calculateProgress(recentGameData);
        const levelSelect = document.getElementById('level-select');
        const level2Option = levelSelect.options[1];
        const level3Option = levelSelect.options[2];
        if (
            progress.averageAccuracy >= 0.8 &&
            progress.maxCorrectGuesses >= 30
        ) {
            level2Option.disabled = false;
        } else {
            level2Option.disabled = true;
        }
        if (
            progress.averageAccuracy >= 0.85 &&
            progress.maxCorrectGuesses >= 50
        ) {
            level3Option.disabled = false;
        } else {
            level3Option.disabled = true;
        }
    } catch (error) {
        console.error('Error fetching or calculating game progress:', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    updateLevelSelectAndCheckUnlock(); // 页面加载时初始化关卡选择器的状态
    
});

const userId = localStorage.getItem('email');
async function fetchRecentGameData(userId) {
    const response = await fetch(`/api/user-game-data/?userId=${userId}&limit=20`);
    if (!response.ok) {
        throw new Error('Failed to fetch recent game data');
    }
    const data = await response.json();
    if(Array.isArray(data)) {
        return data;
    }
    
}
function calculateProgressAndUnlock() {
    fetchRecentGameData(userId).then((recentGameData) => {
  // 对recentGameData进行进一步的操作
  let totalCorrectGuesses1 = 0;
    let totalGames1 = 0;
    let totalAccuracy1 = 0;
    let totalCorrectGuesses2 = 0;
    let totalGames2 = 0;
    let totalAccuracy2 = 0;
    for(let i = 0; i < recentGameData.length; i++) {
      const game = recentGameData[i];
      if(game['level'] === 3) {
        totalCorrectGuesses1 += game.correct_guesses;
        totalAccuracy1 += game.accuracy * 100;
        totalGames1 += 1;
        if(totalGames1 >= 10){
          break;
        }
      }else if(game['level'] === 4) {
        totalCorrectGuesses2 += game.correct_guesses;
        totalAccuracy2 += game.accuracy * 100;
        totalGames2 += 1;
        if(totalGames2 >= 20){
          break;
        }
      }
      
    }
    
    const averageAccuracy1 = totalGames1 > 0 ? totalAccuracy1 / totalGames1 : 0;
    const averageAccuracy2 = totalGames2 > 0 ? totalAccuracy2 / totalGames2 : 0;
    let maxCorrectGuesses1 = 0;
    let maxCorrectGuesses2 = 0;
    for(let i = 0; i < recentGameData.length; i++) {
      const game = recentGameData[i];
      if(game.level === 3) {
        if (game.correct_guesses > maxCorrectGuesses1) {
        maxCorrectGuesses1 = game.correct_guesses;
      }
      }else {
        if(game.level === 4) {
        if (game.correct_guesses > maxCorrectGuesses2) {
        maxCorrectGuesses2 = game.correct_guesses;
      }
      }
      
    }
}
    
    
    try {
        // const recentGameData = fetchRecentGameData(userId);
        const progress1 = {maxCorrectGuesses1, averageAccuracy1};
        const progress2 = {maxCorrectGuesses2, averageAccuracy2};
        const levelSelect = document.getElementById('level-select');
        const level2Option = levelSelect.options[1];
        const level3Option = levelSelect.options[2];
        if (
            progress1.averageAccuracy1 >= 0.8 &&
            progress1.maxCorrectGuesses1 >= 30
        ) {
            level2Option.disabled = false;
        } else {
            level2Option.disabled = true;
        }
        if (
            progress2.averageAccuracy2 >= 0.85 &&
            progress2.maxCorrectGuesses2 >= 20
        ) {
            level3Option.disabled = false;
            level2Option.disabled = false;
        } else {
            level3Option.disabled = true;
        }
    } catch (error) {
        console.error('Error fetching or calculating game progress:', error);
    }
}).catch((error) => {
  console.error('Error fetching or parsing game data:', error);
});
    
}
document.addEventListener('DOMContentLoaded', () => {
    calculateProgressAndUnlock(); // 页面加载时初始化关卡选择器的状态
    
});
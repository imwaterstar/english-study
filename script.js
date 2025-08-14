let wordsData = {};
let currentUnit = '';
let currentWord = '';
let currentIndex = 0;

// 从 words.json 加载单词
fetch('words.json')
  .then(response => response.json())
  .then(data => {
    wordsData = data;
    populateUnitSelect();
  });

// 填充单元选择下拉框
function populateUnitSelect() {
  const unitSelect = document.getElementById('unit-select');
  unitSelect.innerHTML = '';

  // 获取所有单元名（unit1, unit2...）
  const units = Object.keys(wordsData);
  units.forEach(unit => {
    const option = document.createElement('option');
    option.value = unit;
    option.textContent = unit;
    unitSelect.appendChild(option);
  });

  // 默认选择第一个单元并加载
  if (units.length > 0) {
    unitSelect.value = units[0];
    currentUnit = units[0];
    loadUnitWords();
  }
}

// 加载当前单元的单词
function loadUnitWords() {
  currentIndex = 0;
  showWord();
}

// 显示当前单词和字母按钮
function showWord() {
  const words = wordsData[currentUnit];
  if (!words || words.length === 0) return;

  currentWord = words[currentIndex];
  document.getElementById('word-display').textContent = '_ '.repeat(currentWord.length);

  const lettersContainer = document.getElementById('letters-container');
  lettersContainer.innerHTML = '';

  // 获取当前单词的唯一字母
  let uniqueLetters = Array.from(new Set(currentWord.split('')));
  // 额外加一个随机字母
  const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  uniqueLetters.push(randomLetter);

  // 为了达到单词长度的 1.5 倍，重复一些字母
  while (uniqueLetters.length < Math.ceil(currentWord.length * 1.5)) {
    const rand = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    if (!uniqueLetters.includes(rand)) {
      uniqueLetters.push(rand);
    }
  }

  // 打乱字母顺序
  uniqueLetters = shuffleArray(uniqueLetters);

  // 创建字母按钮
  uniqueLetters.forEach(letter => {
    const btn = document.createElement('button');
    btn.textContent = letter;
    btn.addEventListener('click', () => {
      const input = document.getElementById('user-input');
      input.value += letter;
    });
    lettersContainer.appendChild(btn);
  });
}

// 打乱数组顺序
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// 检查答案
function checkAnswer() {
  const input = document.getElementById('user-input');
  if (input.value.toLowerCase() === currentWord.toLowerCase()) {
    alert('正确！');
    input.value = '';
    nextWord();
  } else {
    alert('错误，请重试');
  }
}

// 切换到下一个单词
function nextWord() {
  const words = wordsData[currentUnit];
  currentIndex++;
  if (currentIndex >= words.length) {
    alert('该单元已完成！');
    currentIndex = 0;
  }
  showWord();
}

// 删除最后一个字符
function handleDeleteOne() {
  const input = document.getElementById('user-input');
  if (!input) return;
  input.value = input.value.slice(0, -1);
}

// 绑定事件
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('unit-select').addEventListener('change', (e) => {
    currentUnit = e.target.value;
    loadUnitWords();
  });

  document.getElementById('check-btn').addEventListener('click', checkAnswer);

  const delBtn = document.getElementById('delete-btn');
  if (delBtn) {
    delBtn.addEventListener('click', handleDeleteOne);
  }

  // 支持键盘退格
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      handleDeleteOne();
    }
  });
});






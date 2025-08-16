let data;
let currentUnitWords = [];
let currentWordIndex = 0;

// 加载 JSON
fetch('words.json')
  .then(res => res.json())
  .then(json => {
    data = json;  // 结构固定：{ units: [ { name, words: [...] }, ... ] }
    populateUnitSelect();
  })
  .catch(err => console.error("加载 JSON 出错:", err));

// 填充单元选择框
function populateUnitSelect() {
  const select = document.getElementById('unit-select');
  select.innerHTML = '<option value="">选择单元</option>';

  data.units.forEach((unit, index) => {
    const option = document.createElement('option');
    option.value = index;   // 用数组下标来取
    option.textContent = unit.name;
    select.appendChild(option);
  });
}

// 点击“开始学习”
document.getElementById('start-btn').addEventListener('click', () => {
  const unitIndex = document.getElementById('unit-select').value;
  if (unitIndex === "") return alert("请选择单元！");

  currentUnitWords = data.units[unitIndex].words;
  currentWordIndex = 0;

  document.getElementById('learning-window').style.display = 'block';
  showCurrentWord();
});

// 显示当前单词
function showCurrentWord() {
  if (currentWordIndex >= currentUnitWords.length) {
    alert("本单元学习完毕！");
    document.getElementById('learning-window').style.display = 'none';
    return;
  }
  const wordObj = currentUnitWords[currentWordIndex];
  document.getElementById('word-meaning').textContent = wordObj.japanese;
  document.getElementById('user-input').value = "";
  generateLetterButtons(wordObj.english);
  playWord(wordObj.english);
}

// 播放读音
function playWord(word) {
  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = 'en-US';
  speechSynthesis.speak(utter);
}

// 生成字母按钮
function generateLetterButtons(word) {
  let letters = word.split('');

  // 加一些干扰字母
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  while (letters.length < word.length + 3) {
    const randLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!letters.includes(randLetter)) letters.push(randLetter);
  }

  // 打乱顺序
  letters.sort(() => Math.random() - 0.5);

  const div = document.getElementById('letter-buttons');
  div.innerHTML = "";
  letters.forEach(l => {
    const btn = document.createElement('button');
    btn.textContent = l;
    btn.addEventListener('click', () => {
      document.getElementById('user-input').value += l;
    });
    div.appendChild(btn);
  });
}

// 点击“确定”检查
document.getElementById('check-btn').addEventListener('click', () => {
  const input = document.getElementById('user-input').value.toLowerCase();
  const wordObj = currentUnitWords[currentWordIndex];
  if (input === wordObj.english) {
    alert("正确！");
    currentWordIndex++;
    showCurrentWord();
  } else {
    alert("错误！");
  }
});

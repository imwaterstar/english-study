let data;
let currentUnitWords = [];
let currentWordIndex = 0;
let totalCount = 0;
let wrongCount = 0;

// 加载 JSON
fetch('words.json')
  .then(res => res.json())
  .then(json => {
    data = json.units || [];
    populateUnitSelect();
  })
  .catch(err => console.error("加载 JSON 出错:", err));

// 填充单元选择
function populateUnitSelect() {
  const select = document.getElementById('unit-select');
  select.innerHTML = '<option value="">选择单元</option>';

  data.forEach(unit => {
    const option = document.createElement('option');
    option.value = unit.name;
    option.textContent = unit.name;
    select.appendChild(option);
  });
}

// 点击开始学习
document.getElementById('start-btn').addEventListener('click', () => {
  const unitName = document.getElementById('unit-select').value;
  if (!unitName) return alert("请选择单元！");

  const unit = data.find(u => u.name === unitName);
  currentUnitWords = unit.words || [];
  currentWordIndex = 0;

  document.getElementById('learning-window').style.display = 'block';
  showCurrentWord();
  updateCounter();
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
  speakWord(wordObj.english);
}

// 播放语音
function speakWord(word) {
  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = 'en-US';
  speechSynthesis.speak(utter);
}

// 生成字母按钮
function generateLetterButtons(word){
  const allLettersSet = new Set();
  currentUnitWords.forEach(w => w.english.split('').forEach(l => allLettersSet.add(l)));

  let letters = Array.from(allLettersSet);
  word.split('').forEach(l => { if(!letters.includes(l)) letters.push(l); });

  const targetCount = Math.ceil(word.length * 1.5);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  while(letters.length < targetCount){
    const randLetter = alphabet[Math.floor(Math.random()*alphabet.length)];
    if(!letters.includes(randLetter)) letters.push(randLetter);
  }

  letters.sort(() => Math.random()-0.5);

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

// 点击确认检查
document.getElementById('check-btn').addEventListener('click', () => {
  const input = document.getElementById('user-input').value.toLowerCase();
  const wordObj = currentUnitWords[currentWordIndex];
  if (!wordObj) return;

  totalCount++;

  if(input === wordObj.english){
    alert("正确！");
  } else {
    alert(`错误！`);
    wrongCount++;
  }

  updateCounter();
  currentWordIndex++;
  showCurrentWord();

  // 点击确认再播放一次语音
  speakWord(wordObj.english);
});

// 删除按钮
document.getElementById('delete-btn').addEventListener('click', () => {
  const input = document.getElementById('user-input');
  input.value = input.value.slice(0, -1);
});

// 更新计数器
function updateCounter() {
  let counter = document.getElementById("counter-display");
  if(!counter){
    counter = document.createElement("p");
    counter.id = "counter-display";
    document.getElementById('learning-window').prepend(counter);
  }
  counter.textContent = `总练习: ${totalCount} | 拼写错误: ${wrongCount}`;
}

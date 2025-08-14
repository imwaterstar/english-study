let data;
let currentUnitWords = [];
let currentWordIndex = 0;

// 加载 JSON
fetch('words.json')
  .then(res => res.json())
  .then(json => {
    data = json; // 顶层对象，单元名作为 key
    populateUnitSelect();
  })
  .catch(err => console.error("加载 JSON 出错:", err));

// 填充单元选择
function populateUnitSelect() {
  const select = document.getElementById('unit-select');
  select.innerHTML = '<option value="">选择单元</option>';

  Object.keys(data).forEach(unitName => {
    const option = document.createElement('option');
    option.value = unitName; // 单元名作为 value
    option.textContent = unitName;
    select.appendChild(option);
  });
}

// 点击开始学习
document.getElementById('start-btn').addEventListener('click', () => {
  const unitName = document.getElementById('unit-select').value;
  if (!unitName) return alert("请选择单元！");

  currentUnitWords = data[unitName];
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
function playWord(word){
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

// 删除最后一个字母
document.getElementById('delete-btn').addEventListener('click', () => {
  const input = document.getElementById('user-input');
  input.value = input.value.slice(0, -1);
});

// 点击确定检查
document.getElementById('check-btn').addEventListener('click', ()=>{
  const input = document.getElementById('user-input').value.toLowerCase();
  const wordObj = currentUnitWords[currentWordIndex];
  if(input === wordObj.english){
    alert("正确！");
    currentWordIndex++;
    showCurrentWord();
  } else {
    alert("错误！");
  }
});



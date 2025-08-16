let data;
let currentUnit = null;
let currentWordIndex = 0;

// 加载 JSON
fetch('words.json')
  .then(res => res.json())
  .then(json => {
    data = json.units;
    populateUnitSelect();
  });

// 填充单元选择
function populateUnitSelect() {
  const select = document.getElementById('unit-select');
  data.forEach((unit, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = unit.name;
    select.appendChild(option);
  });
}

// 点击开始学习
document.getElementById('start-btn').addEventListener('click', () => {
  const unitIndex = document.getElementById('unit-select').value;
  if(unitIndex === "") return alert("请选择单元！");
  currentUnit = data[unitIndex];
  currentWordIndex = 0;
  document.getElementById('learning-window').style.display = 'block';
  showCurrentWord();
});

// 显示当前单词
function showCurrentWord() {
  if(currentWordIndex >= currentUnit.words.length){
    alert("本单元学习完毕！");
    document.getElementById('learning-window').style.display = 'none';
    return;
  }
  const wordObj = currentUnit.words[currentWordIndex];
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
  currentUnit.words.forEach(w => w.english.split('').forEach(l => allLettersSet.add(l)));
  
  let letters = Array.from(allLettersSet);
  
  // 当前单词字母
  word.split('').forEach(l => { if(!letters.includes(l)) letters.push(l); });
  
  // 计算目标数量
  const targetCount = Math.ceil(word.length * 1.5);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  while(letters.length < targetCount){
    const randLetter = alphabet[Math.floor(Math.random()*alphabet.length)];
    if(!letters.includes(randLetter)) letters.push(randLetter);
  }
  
  // 打乱
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

// 点击确定检查
document.getElementById('check-btn').addEventListener('click', ()=>{
  const input = document.getElementById('user-input').value.toLowerCase();
  const wordObj = currentUnit.words[currentWordIndex];
  if(input === wordObj.english){
    alert("正确！");
    currentWordIndex++;
    showCurrentWord();
  } else {
    alert("错误！");
  }
});

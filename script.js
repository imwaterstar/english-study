let data;
let currentUnitWords = [];
let currentWordIndex = 0;

// 加载 JSON
fetch("words.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    populateUnitList();  // 填充左侧导航栏
  })
  .catch(err => console.error("加载 JSON 出错:", err));

// 左侧导航栏
function populateUnitList() {
  const ul = document.getElementById("unit-list");
  data.units.forEach((unit, index) => {
    const li = document.createElement("li");
    li.textContent = unit.name;
    li.addEventListener("click", () => {
      loadUnit(index);
    });
    ul.appendChild(li);
  });
}

// 点击左侧单元
function loadUnit(unitIndex) {
  currentUnitWords = data.units[unitIndex].words;
  currentWordIndex = 0;
  document.getElementById("learning-window").style.display = "block";
  showCurrentWord();
}

// 显示当前单词
function showCurrentWord() {
  if (currentWordIndex >= currentUnitWords.length) {
    alert("本单元学习完毕！");
    document.getElementById("learning-window").style.display = "none";
    return;
  }
  const wordObj = currentUnitWords[currentWordIndex];
  document.getElementById("word-meaning").textContent = wordObj.japanese;
  document.getElementById("user-input").value = "";
  generateLetterButtons(wordObj.english);
  playWord(wordObj.english);
}

// 播放读音
function playWord(word) {
  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

// 生成字母按钮
function generateLetterButtons(word) {
  const container = document.getElementById("letter-buttons");
  container.innerHTML = "";
  let letters = word.split("");

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  while (letters.length < Math.ceil(word.length * 1.5)) {
    const randLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!letters.includes(randLetter)) letters.push(randLetter);
  }

  letters.sort(() => Math.random() - 0.5);

  letters.forEach(l => {
    const btn = document.createElement("button");
    btn.textContent = l;
    btn.addEventListener("click", () => {
      document.getElementById("user-input").value += l;
    });
    container.appendChild(btn);
  });
}

// 点击“确认”
document.getElementById("check-btn").addEventListener("click", () => {
  const input = document.getElementById("user-input").value.toLowerCase();
  const wordObj = currentUnitWords[currentWordIndex];
  if (input === wordObj.english) {
    alert("正确！");
    currentWordIndex++;
    showCurrentWord();
  } else {
    alert("错误！");
  }
});

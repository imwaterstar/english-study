let data = null;
let currentUnitWords = [];
let currentWordIndex = 0;

// 页面加载时获取 words.json
fetch("words.json")
  .then(response => response.json())
  .then(json => {
    data = json;
    populateUnitSelect();
  });

// 把 units 填充到下拉框
function populateUnitSelect() {
  const select = document.getElementById("unit-select");
  select.innerHTML = "";
  data.units.forEach((unit, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = unit.name;
    select.appendChild(option);
  });
}

// 点击开始学习
document.getElementById("start-btn").addEventListener("click", () => {
  const unitIndex = parseInt(document.getElementById("unit-select").value, 10);
  if (isNaN(unitIndex)) {
    alert("请选择单元！");
    return;
  }
  currentUnitWords = data.units[unitIndex].words;
  currentWordIndex = 0;

  document.getElementById("learning-window").style.display = "block";
  showCurrentWord();
});

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

// 生成字母按钮
function generateLetterButtons(word) {
  const container = document.getElementById("letter-buttons");
  container.innerHTML = "";
  const letters = word.split("").sort(() => Math.random() - 0.5);
  letters.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.addEventListener("click", () => {
      document.getElementById("user-input").value += letter;
    });
    container.appendChild(btn);
  });
}

// 下一个单词
document.getElementById("next-btn").addEventListener("click", () => {
  currentWordIndex++;
  showCurrentWord();
});

// 朗读
function playWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

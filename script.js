let data;
let currentUnitWords = [];
let currentWordIndex = 0;
let wrongWords = [];
let totalCount = 0;
let wrongCount = 0;

// 加载 JSON
fetch("words.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    populateUnitList();
  })
  .catch(err => console.error("加载 JSON 出错:", err));

// 左侧导航栏填充单元
function populateUnitList() {
  const ul = document.getElementById("unit-list");
  ul.innerHTML = "";
  data.units.forEach((unit, index) => {
    const li = document.createElement("li");
    li.textContent = unit.name;
    li.addEventListener("click", () => loadUnit(index));
    ul.appendChild(li);
  });
}

// 加载单元
function loadUnit(unitIndex) {
  currentUnitWords = data.units[unitIndex].words;
  currentWordIndex = 0;
  wrongWords = [];
  totalCount = 0;
  wrongCount = 0;
  updateCounter();
  const learningWindow = document.getElementById("learning-window");
  learningWindow.style.display = "block";
  document.getElementById("word-meaning").textContent = "";
  document.getElementById("user-input").value = "";
  document.getElementById("letter-buttons").innerHTML = "";
  document.getElementById("correct-word").textContent = "";
  
  document.getElementById("learning-window").style.display = "block";
  showCurrentWord();
  setupButtonContainer();
  
}

// 显示当前单词
function showCurrentWord() {
  if (currentWordIndex >= currentUnitWords.length) {
    if (wrongWords.length > 0) {
      currentUnitWords = [...wrongWords];
      wrongWords = [];
      currentWordIndex = 0;
    } else {
      alert(`本单元练习完成！总练习: ${totalCount}, 拼写错误: ${wrongCount}`);
      document.getElementById("learning-window").style.display = "none";
      return;
    }
  }

  const wordObj = currentUnitWords[currentWordIndex];
  document.getElementById("word-meaning").textContent = wordObj.japanese;
  document.getElementById("user-input").value = "";
  // 不清空 correct-word，上一单词正确拼写会保留
  generateLetterButtons(wordObj.english);
  playWord(wordObj.english);
}

// 播放语音
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

// 设置按钮容器（确认 + 删除）
function setupButtonContainer() {
  let container = document.getElementById("button-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "button-container";
    document.getElementById("learning-window").appendChild(container);

    // 确认按钮
    const checkBtn = document.createElement("button");
    checkBtn.textContent = "确认";
    checkBtn.id = "check-btn";
    container.appendChild(checkBtn);

    // 删除按钮
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "删除";
    deleteBtn.id = "delete-btn";
    container.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
      const input = document.getElementById("user-input");
      input.value = input.value.slice(0, -1);
    });

    checkBtn.addEventListener("click", () => {
      const input = document.getElementById("user-input").value.toLowerCase();
      const wordObj = currentUnitWords[currentWordIndex];

      // 播放语音
      playWord(wordObj.english);

      totalCount++;

      const correctDisplay = document.getElementById("correct-word");
      container.appendChild(correctDisplay);
      correctDisplay.textContent = `正确写法: ${wordObj.english}`; // 总是显示当前单词正确写法

      if (input === wordObj.english) {
        currentWordIndex++;
      } else {
        wrongCount++;
        if (!wrongWords.includes(wordObj)) wrongWords.push(wordObj);
        currentWordIndex++;
      }

      updateCounter();
      showCurrentWord();
    });
  }
}

// 计数器显示
const counterDisplay = document.createElement("p");
counterDisplay.id = "counter-display";
document.getElementById("learning-window").prepend(counterDisplay);
function updateCounter() {
  counterDisplay.textContent = `总练习: ${totalCount} | 拼写错误: ${wrongCount}`;
}

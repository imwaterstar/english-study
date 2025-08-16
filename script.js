let currentUnitWords = [];
let currentWordIndex = 0;
let wrongWords = [];
let totalCount = 0;
let wrongCount = 0;

// 语音播放
function playWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

// 显示当前单词
function showCurrentWord() {
  if (currentWordIndex >= currentUnitWords.length) {
    document.getElementById("learning-window").innerHTML = `
      <p>本单元已完成！</p>
      <p>总练习: ${totalCount} | 拼写错误: ${wrongCount}</p>
      <button id="review-btn">复习错误单词</button>
    `;

    // 复习错词
    document.getElementById("review-btn").addEventListener("click", () => {
      if (wrongWords.length > 0) {
        currentUnitWords = [...wrongWords];
        currentWordIndex = 0;
        wrongWords = [];
        showCurrentWord();
      } else {
        document.getElementById("learning-window").innerHTML += `<p>没有错误单词需要复习！</p>`;
      }
    });
    return;
  }

  const wordObj = currentUnitWords[currentWordIndex];
  document.getElementById("word-meaning").textContent = wordObj.japanese;

  // 清空输入框
  const input = document.getElementById("user-input");
  input.value = "";
  input.removeAttribute("readonly");

  // 清空正确答案提示
  const correctDisplay = document.getElementById("correct-word");
  correctDisplay.textContent = "";
}

// 点击确认按钮
const Btn = document.getElementById("check-btn");
Btn.addEventListener("click", () => {
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  const wordObj = currentUnitWords[currentWordIndex];

  totalCount++;

  const correctDisplay = document.getElementById("correct-word");

  if (input === wordObj.english.toLowerCase()) {
    correctDisplay.textContent = "";
    currentWordIndex++;
  } else {
    wrongCount++;
    if (!wrongWords.includes(wordObj)) wrongWords.push(wordObj);
    correctDisplay.textContent = `正确写法: ${wordObj.english}`;
    correctDisplay.style.color = "red";
    correctDisplay.style.fontWeight = "bold";
    currentWordIndex++;
  }

  updateCounter();
  showCurrentWord();

  // 确认后再播放一次语音
  playWord(wordObj.english);
});

// 计数器显示
const counterDisplay = document.createElement("p");
counterDisplay.id = "counter-display";
document.getElementById("learning-window").prepend(counterDisplay);

function updateCounter() {
  counterDisplay.textContent = `总练习: ${totalCount} | 拼写错误: ${wrongCount}`;
}

// 加载单词数据
fetch("words.json")
  .then((response) => response.json())
  .then((data) => {
    currentUnitWords = data; // 默认加载全部
    showCurrentWord();
  });

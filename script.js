let currentWordIndex = 0;
let wrongWords = [];
let totalCount = 0;
let wrongCount = 0;

// 假设你有一个词汇数组（示例）
const currentUnitWords = [
  { english: "apple", japanese: "りんご" },
  { english: "banana", japanese: "バナナ" },
  { english: "grape", japanese: "ぶどう" }
];

// =======================
//  工具函数
// =======================

// 播放单词语音（简化示例）
function playWord(word) {
  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

// 获取或创建确认按钮
function getOrCreateCheckBtn() {
  let btn = document.getElementById("check-btn");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "check-btn";
    btn.textContent = "确认";
    document.getElementById("learning-window").appendChild(btn);
  }
  return btn;
}

// 获取或创建正确拼写提示
function getOrCreateCorrectWordEl() {
  let p = document.getElementById("correct-word");
  if (!p) {
    p = document.createElement("p");
    p.id = "correct-word";
    document.getElementById("learning-window").appendChild(p);
  }
  return p;
}

// =======================
//  UI 显示相关
// =======================

// 显示当前单词的日文提示
function showCurrentWord() {
  if (currentWordIndex >= currentUnitWords.length) {
    // 如果有错词，进入复习
    if (wrongWords.length > 0) {
      currentUnitWords.push(...wrongWords);
      wrongWords = [];
      currentWordIndex = 0;
    } else {
      alert("本单元完成！");
      return;
    }
  }

  const wordObj = currentUnitWords[currentWordIndex];
  document.getElementById("japanese-word").textContent = wordObj.japanese;
  document.getElementById("user-input").value = "";
  playWord(wordObj.english);
}

// 更新计数器
function updateCounter() {
  const counterDisplay = document.getElementById("counter-display");
  counterDisplay.textContent = `总练习: ${totalCount} | 拼写错误: ${wrongCount}`;
}

// =======================
//  初始化
// =======================
document.addEventListener("DOMContentLoaded", () => {
  // 确保学习窗口存在
  const learningWindow = document.getElementById("learning-window");

  // 计数器
  let counterDisplay = document.getElementById("counter-display");
  if (!counterDisplay) {
    counterDisplay = document.createElement("p");
    counterDisplay.id = "counter-display";
    learningWindow.prepend(counterDisplay);
  }

  // 获取按钮并绑定事件
  const Btn = getOrCreateCheckBtn();

  Btn.addEventListener("click", () => {
    const input = document.getElementById("user-input").value.trim().toLowerCase();
    const wordObj = currentUnitWords[currentWordIndex];
    if (!wordObj) return;

    // 播放语音
    playWord(wordObj.english);

    totalCount++;
    const correctDisplay = getOrCreateCorrectWordEl();

    if (input === wordObj.english.toLowerCase()) {
      // 正确
      correctDisplay.textContent = "";
      currentWordIndex++;
    } else {
      // 错误
      wrongCount++;
      if (!wrongWords.includes(wordObj)) wrongWords.push(wordObj);
      correctDisplay.textContent = `正确写法: ${wordObj.english}`;
      correctDisplay.style.color = "red";
      correctDisplay.style.fontWeight = "bold";
      currentWordIndex++;
    }

    updateCounter();
    showCurrentWord();
  });

  // 开始第一题
  showCurrentWord();
  updateCounter();
});

let currentUnitWords = [];  // 当前单元单词
let currentIndex = 0;       // 当前单词索引
let wrongWords = [];        // 错词列表
let totalCount = 0;
let wrongCount = 0;

// =======================
// 加载 JSON 文件
// =======================
fetch("words.json")
  .then(res => res.json())
  .then(json => {
    if (!json.units || json.units.length === 0) throw new Error("words.json结构错误");
    // 默认加载第一个单元
    currentUnitWords = json.units[0].words || [];
    document.getElementById("learning-window").style.display = "block";
    showCurrentWord();
    updateCounter();
  })
  .catch(err => {
    console.error("加载 JSON 出错:", err);
    // 兜底示例
    currentUnitWords = [
      { english: "apple", japanese: "りんご" },
      { english: "banana", japanese: "バナナ" },
      { english: "grape", japanese: "ぶどう" }
    ];
    document.getElementById("learning-window").style.display = "block";
    showCurrentWord();
    updateCounter();
  });

// =======================
// 显示当前单词
// =======================
function showCurrentWord() {
  if (currentIndex >= currentUnitWords.length) {
    // 如果有错词，重新练习
    if (wrongWords.length > 0) {
      currentUnitWords = [...wrongWords];
      wrongWords = [];
      currentIndex = 0;
    } else {
      alert(`本单元练习完成！总练习: ${totalCount} | 拼写错误: ${wrongCount}`);
      document.getElementById("learning-window").style.display = "none";
      return;
    }
  }

  const wordObj = currentUnitWords[currentIndex];
  if (!wordObj) return;

  document.getElementById("word-meaning").textContent = wordObj.japanese;
  document.getElementById("user-input").value = "";
  document.getElementById("result").textContent = "";
  document.getElementById("correct-word").textContent = "";

  generateLetterButtons(wordObj.english);
  speakWord(wordObj.english);
}

// =======================
// 播放语音
// =======================
function speakWord(word) {
  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

// =======================
// 生成字母按钮
// =======================
function generateLetterButtons(word) {
  const div = document.getElementById("letter-buttons");
  div.innerHTML = "";

  const allLettersSet = new Set();
  currentUnitWords.forEach(w => w.english.split('').forEach(l => allLettersSet.add(l)));
  let letters = Array.from(allLettersSet);
  word.split('').forEach(l => { if (!letters.includes(l)) letters.push(l); });

  const targetCount = Math.ceil(word.length * 1.5);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  while (letters.length < targetCount) {
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
    div.appendChild(btn);
  });
}

// =======================
// 确认答案
// =======================
document.getElementById("check-btn").addEventListener("click", checkAnswer);

function checkAnswer() {
  const userInput = document.getElementById("user-input").value.trim().toLowerCase();
  const wordObj = currentUnitWords[currentIndex];
  if (!wordObj) return;

  // 点击确认后再播放一次语音
  speakWord(wordObj.english);

  totalCount++;
  const resultDiv = document.getElementById("result");
  const correctWordEl = document.getElementById("correct-word");

  if (userInput === wordObj.english.toLowerCase()) {
    resultDiv.textContent = "正确！";
    resultDiv.style.color = "green";
    correctWordEl.textContent = "";
  } else {
    resultDiv.textContent = `错误！正确写法是：${wordObj.english}`;
    resultDiv.style.color = "red";
    correctWordEl.textContent = `正确拼写：${wordObj.english}`;
    correctWordEl.style.color = "red";
    correctWordEl.style.fontWeight = "bold";

    if (!wrongWords.includes(wordObj)) wrongWords.push(wordObj);
    wrongCount++;
  }

  updateCounter();
  currentIndex++;
  showCurrentWord();
}

// =====================

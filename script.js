let wordsData = {};
let currentUnit = [];
let currentWord = {};
let userInput = "";

// 1. 加载 words.json 并填充下拉框
fetch('words.json')
  .then(response => response.json())
  .then(data => {
    wordsData = data;
    populateUnitSelect();
  })
  .catch(error => console.error("加载 words.json 出错:", error));

// 2. 填充下拉框
function populateUnitSelect() {
  const unitSelect = document.getElementById("unit-select");
  unitSelect.innerHTML = ""; // 清空

  // 取 JSON 的 key (unit1, unit2 ...)
  Object.keys(wordsData).forEach(unit => {
    const option = document.createElement("option");
    option.value = unit;
    option.textContent = unit;
    unitSelect.appendChild(option);
  });
}

// 3. 点击“开始学习”
document.getElementById("start-btn").addEventListener("click", () => {
  const unitSelect = document.getElementById("unit-select");
  const selectedUnit = unitSelect.value;

  if (!selectedUnit || !wordsData[selectedUnit]) {
    alert("请选择一个单元");
    return;
  }

  currentUnit = wordsData[selectedUnit];
  document.getElementById("unit-select-container").style.display = "none"; // 隐藏选择界面
  document.getElementById("learning-window").style.display = "block";      // 显示学习界面
  loadNewWord();
});

// 4. 加载一个新单词
function loadNewWord() {
  const randomIndex = Math.floor(Math.random() * currentUnit.length);
  currentWord = currentUnit[randomIndex];
  userInput = "";

  document.getElementById("word-meaning").textContent = currentWord.meaning;
  document.getElementById("user-input").value = "";

  generateLetterButtons(currentWord.word);
}

// 5. 生成字母按钮
function generateLetterButtons(word) {
  const container = document.getElementById("letter-buttons");
  container.innerHTML = "";

  let letters = word.split(""); // 单词的所有字母
  let extraLetters = "abcdefghijklmnopqrstuvwxyz".split("");
  // 添加一些随机字母，保证按钮数 ≈ 1.5 倍
  while (letters.length < word.length * 1.5) {
    const rand = extraLetters[Math.floor(Math.random() * extraLetters.length)];
    letters.push(rand);
  }

  // 打乱顺序
  letters = letters.sort(() => Math.random() - 0.5);

  // 生成按钮
  letters.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.addEventListener("click", () => {
      userInput += letter;
      document.getElementById("user-input").value = userInput;
    });
    container.appendChild(btn);
  });

  // 增加删除按钮
  const delBtn = document.createElement("button");
  delBtn.textContent = "⌫ 删除";
  delBtn.style.backgroundColor = "red";
  delBtn.style.color = "white";
  delBtn.addEventListener("click", () => {
    userInput = userInput.slice(0, -1);
    document.getElementById("user-input").value = userInput;
  });
  container.appendChild(delBtn);
}

// 6. 检查答案
document.getElementById("check-btn").addEventListener("click", () => {
  if (userInput.toLowerCase() === currentWord.word.toLowerCase()) {
    alert("✅ 正确！换一个单词");
    loadNewWord();
  } else {
    alert("❌ 错误，请重试");
    userInput = "";
    document.getElementById("user-input").value = "";
  }
});



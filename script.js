let allWords = [];
let currentUnit = null;
let currentIndex = 0;
let letterFields = [];

// 加载 JSON 数据并初始化单元选择
function loadWords() {
    // 尝试从 localStorage 缓存读取
    let cached = localStorage.getItem("wordsData");
    if (cached) {
        allWords = JSON.parse(cached);
        initUnitSelect();
    } else {
        fetch("words.json")
            .then(res => res.json())
            .then(data => {
                allWords = data;
                localStorage.setItem("wordsData", JSON.stringify(data)); // 缓存
                initUnitSelect();
            })
            .catch(err => console.error("加载 JSON 失败", err));
    }
}

function initUnitSelect() {
    let unitSelect = document.getElementById("unit-select");
    let units = [...new Set(allWords.map(w => w.unit))];
    units.forEach(u => {
        let opt = document.createElement("option");
        opt.value = u;
        opt.textContent = "Unit " + u;
        unitSelect.appendChild(opt);
    });
}

// 开始学习按钮
document.getElementById("start-btn").addEventListener("click", () => {
    currentUnit = parseInt(document.getElementById("unit-select").value);
    currentIndex = parseInt(localStorage.getItem(`unit${currentUnit}_progress`)) || 0;
    document.getElementById("select-unit").style.display = "none";
    document.getElementById("study-area").style.display = "block";
    loadWord();
});

// 加载当前单词
function loadWord() {
    let words = allWords.filter(w => w.unit === currentUnit);
    if (currentIndex >= words.length) {
        alert("本单元学习完毕！");
        document.getElementById("study-area").style.display = "none";
        document.getElementById("select-unit").style.display = "block";
        return;
    }
    let w = words[currentIndex];
    document.getElementById("meaning").textContent = w.meaning;

    // 清空之前输入框
    let panel = document.getElementById("letter-panel");
    panel.innerHTML = "";
    letterFields = [];

    for (let i = 0; i < w.word.length; i++) {
        let input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.className = "letter";
        panel.appendChild(input);
        letterFields.push(input);
    }

    document.getElementById("result").textContent = "";
}

// 检查答案
document.getElementById("check-btn").addEventListener("click", () => {
    let userInput = letterFields.map(f => f.value.trim()).join("");
    let w = allWords.filter(w => w.unit === currentUnit)[currentIndex];

    if (userInput.toLowerCase() === w.word.toLowerCase()) {
        document.getElementById("result").textContent = "正解！";
    } else {
        document.getElementById("result").textContent = `不正解。正解は ${w.word}`;
    }

    // 发音
    let utter = new SpeechSynthesisUtterance(w.word);
    utter.lang = "en-US";
    speechSynthesis.speak(utter);

    // 更新进度
    currentIndex++;
    localStorage.setItem(`unit${currentUnit}_progress`, currentIndex);

    setTimeout(loadWord, 1000); // 1 秒后加载下一个单词
});

// 初始化
loadWords();

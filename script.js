let words = [];
let currentWord = '';
let currentMeaning = '';
let currentUnit = '';
let guessedWord = '';
let availableLetters = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('words.json')
        .then(response => response.json())
        .then(data => {
            words = data;
            populateUnitSelect();
        });

    document.getElementById('unitSelect').addEventListener('change', startGame);
});

function populateUnitSelect() {
    const unitSelect = document.getElementById('unitSelect');
    const units = [...new Set(words.map(word => word.unit))];
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        unitSelect.appendChild(option);
    });
}

function startGame() {
    const unitSelect = document.getElementById('unitSelect');
    currentUnit = unitSelect.value;
    if (!currentUnit) return;
    const unitWords = words.filter(word => word.unit === currentUnit);
    if (unitWords.length === 0) return;

    const randomIndex = Math.floor(Math.random() * unitWords.length);
    const { word, meaning } = unitWords[randomIndex];
    currentWord = word.toLowerCase();
    currentMeaning = meaning;
    guessedWord = '';
    document.getElementById('meaning').textContent = currentMeaning;
    document.getElementById('guessedWord').textContent = '_ '.repeat(currentWord.length);

    generateLetterButtons(unitWords);
}

function generateLetterButtons(unitWords) {
    const letterButtons = document.getElementById('letterButtons');
    letterButtons.innerHTML = '';

    // 生成所有单词中可能的字母
    const allLetters = [...new Set(unitWords.flatMap(w => w.word.toLowerCase().split('')))];
    
    // 增加随机字母
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    while (allLetters.length < Math.ceil(currentWord.length * 1.5)) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!allLetters.includes(randomLetter)) {
            allLetters.push(randomLetter);
        }
    }

    // 打乱顺序
    availableLetters = allLetters.sort(() => Math.random() - 0.5);

    // 创建字母按钮
    availableLetters.forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.addEventListener('click', () => guessLetter(letter));
        letterButtons.appendChild(button);
    });

    // 创建删除按钮
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '⌫ 删除';
    deleteButton.style.backgroundColor = '#f88';
    deleteButton.addEventListener('click', deleteLastLetter);
    letterButtons.appendChild(deleteButton);
}

function guessLetter(letter) {
    guessedWord += letter;
    updateGuessedWord();
}

function deleteLastLetter() {
    if (guessedWord.length > 0) {
        guessedWord = guessedWord.slice(0, -1);
        updateGuessedWord();
    }
}

function updateGuessedWord() {
    let display = guessedWord.split('').join(' ');
    display += ' _'.repeat(currentWord.length - guessedWord.length);
    document.getElementById('guessedWord').textContent = display.trim();

    if (guessedWord.length === currentWord.length) {
        if (guessedWord === currentWord) {
            alert('正确！');
        } else {
            alert('错误！正确答案是：' + currentWord);
        }
        startGame();
    }
}








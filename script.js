//REFERENCES
const line1 = document.getElementById("1");
const line2 = document.getElementById("2");
const line3 = document.getElementById("3");
const buttonPress = document.getElementById("writing-area");
const resultArea = document.getElementById("result-area");
const wpm = document.getElementById("wpm");
const resultDescription = document.getElementById("result-description");

//VARIABLES 
let currentWord = 1;
let currentLetter = 1;
const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let correct = 0;

//WORDS
const words = ['such', 'possible', 'just', 'we', 'program', 'new', 'time', 'way', 'she', 'even', 'may', 
    'present', 'child', 'right', 'get', 'will', 'know', 'much', 'one', 'those', 'without', 'pubilc', 'but', 'over', 
    'develop', 'from', 'on', 'the', 'never', 'play', 'where', 'before', 'there', 'house', 'what', 'well', 'early', 'course', 
    'through', 'all', 'consider', 'group', 'follow', 'few', 'move', 'he', 'how', 'word', 'who', 'a', 'show', 'run', 'after', 
    'between', 'it', 'see', 'they', 'year', 'part', 'number', 'and', 'with', 'form', 'eye', 'open', 'person', 'by', 'never', 
    'system', 'still', 'back', 'make', 'stand', 'say', 'not', 'each', 'would', 'old', 'no', 'seem', 'most', 'school', 'leave', 
    'about', 'however', 'problem', 'small', 'if', 'increase', 'of', 'high', 'mean', 'order', 'now', 'same', 'must', 'fact', 'under', 
    'think', 'other', 'many', 'interest', 'feel', 'give', 'tell', 'any', 'last', 'go', 'first', 'state', 'or', 'this', 'late', 'also', 
    'lead', 'help', 'life', 'out', 'come', 'set', 'up', 'want', 'against', 'great', 'another', 'long'];

let row1 = [];
let row2 = [];
let row3 = [];

let changingPoint = 25;

//FUNCTIONS
const generateRows = () => {
    for (let i = 0; i<12; i++) {
        row1.push(words[parseInt(Math.random() * (words.length - 1))]);
        row2.push(words[parseInt(Math.random() * (words.length - 1))]);
        row3.push(words[parseInt(Math.random() * (words.length - 1))]);
    }
    addWords(row1, line1, 1);
    addWords(row2, line2, 13);
    addWords(row3, line3, 25);
}

const addWords = (row, line, num) => {
    let string = ``;
    wordCount = num; 
    for (let word of row) {
        letterCount = 1; 
        for (let letter of word) {
            string += `<span id="word-${wordCount}-letter-${letterCount}">${letter}</span>`;
            letterCount++;
        }
        string += (wordCount % 12) === (row.length % 12) ? ``: `   `;
        wordCount++;
    }
    line.innerHTML = string;
}

document.body.addEventListener("keydown", (ev) => {
    let line = row1;
    const letter = ev.key.toLowerCase();

    if (currentWord === changingPoint & currentLetter === 1) {
        row1 = [...row2];
        row2 = [...row3];
        row3 = [];
        for (let i = 0; i<12; i++) {
            row3.push(words[parseInt(Math.random() * (words.length - 1))]);
        }
        line1.innerHTML = line2.innerHTML
        changingPoint += 12;
        addWords(row2, line2, changingPoint - 12);
        addWords(row3, line3, changingPoint);
        currentLetter = 1;
        currentWord = changingPoint - 12;

        remove_cursor(row1, row2, row3);
        set_cursor(currentWord, currentLetter);
    }
    
    if (LETTERS.includes(letter)) {
        let line = row1;
        if (currentWord > changingPoint - 13) line = row2;
        if (currentWord > changingPoint - 1) line = row3;
        const letterElement = document.getElementById(`word-${currentWord}-letter-${currentLetter}`);
        if (line[((currentWord - 1) % 12)][currentLetter - 1] === letter) {
            letterElement.classList.add("gray");
            currentLetter++;
        } else {
            letterElement.classList.add("red");
            currentLetter++;
        }
        if (currentLetter === line[((currentWord - 1) % 12)].length) {
            if (is_correct(currentWord, line)) correct++;
        }
    } else {
        if (letter === " ") {
            let row = row1;
            if (currentWord > changingPoint - 13) row = row2;
            if (currentWord > changingPoint - 1) row = row3;
            if (currentLetter <= row[((currentWord - 1) % 12)].length){
                for (let i=currentLetter; i <= row[((currentWord - 1) % 12)].length; i++) {
                    const letterElement = document.getElementById(`word-${currentWord}-letter-${i}`);
                    if (letterElement) letterElement.classList.add("red");
                }
            }
            currentWord++;
            currentLetter = 1;
        } else if (letter === "backspace") {
            if (currentLetter === 1 & currentWord != 1) {
                currentWord--;
                let row = row1;
                if (currentWord > changingPoint - 13) row = row2;
                if (currentWord > changingPoint - 1) row = row3;
                currentLetter = row[((currentWord - 1) % 12)].length
                const letterElement = document.getElementById(`word-${currentWord}-letter-${currentLetter}`);
                letterElement.classList.remove("gray");
                letterElement.classList.remove("red");
            } else if (!(currentLetter === 1 & currentWord == 1)) {
                currentLetter--;
                const letterElement = document.getElementById(`word-${currentWord}-letter-${currentLetter}`);
                letterElement.classList.remove("gray");
                letterElement.classList.remove("red");
            }
        }
    }
    remove_cursor(row1, row2, row3, (changingPoint - 24));
    set_cursor(currentWord, currentLetter);
})

const set_cursor = (word_id, letter_id) => {
    const letterElement = document.getElementById(`word-${word_id}-letter-${letter_id}`);
    if (letterElement) letterElement.classList.add("cursor");
}

const remove_cursor = (line1, line2, line3, num) => {
    let word_num = num;
    for (let word of line1) {
        let letter_num = 1;
        for (let letter in word) {
            const element = document.getElementById(`word-${word_num}-letter-${letter_num}`);
            element.classList.remove("cursor");
            letter_num++;
        }
        word_num++;
    }

    for (let word of line2) {
        let letter_num = 1;
        for (let letter in word) {
            const element = document.getElementById(`word-${word_num}-letter-${letter_num}`);
            element.classList.remove("cursor");
            letter_num++;
        }
        word_num++;
    }

    for (let word of line3) {
        let letter_num = 1;
        for (let letter in word) {
            const element = document.getElementById(`word-${word_num}-letter-${letter_num}`);
            element.classList.remove("cursor");
            letter_num++;
        }
        word_num++;
    }
}  

const is_correct = (word_id, row) => {
    let letter_id = 1;
    for (let letter of row[(word_id - 1) % 12]) {
        let element = document.getElementById(`word-${word_id}-letter-${letter_id}`);
        if (element.classList.contains("red")) return false
        letter_id++;
    }
    return true
}

//TIMER
let timerInterval;
let timeLeft = 30;
let isTimerRunning = false; // Flag to track if the timer is running

function updateTimer() {
    document.getElementById('timer').textContent = `${timeLeft}`;
}

function startTimer() {
    if (isTimerRunning) return; // Prevent multiple starts

    isTimerRunning = true; // Set the flag to true
    timeLeft = 30;
    updateTimer();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            buttonPress.style.display = "none";
            resultArea.style.display = "block";
            wpm.textContent = (correct * 2);
            resultDescription.textContent = findDescription((correct*2))
        }
    }, 1000);
}

document.addEventListener('keydown', () => {
    startTimer();
});

const findDescription = (result) => {
    if (result > 90) {
        return "Outstanding! You type extremely fast!"
    } else if (result > 70) {
        return "Very Good! You type faster then most people."
    } else if (result > 60) {
        return "Good typing speed!"
    } else if (result > 30) {
        return "Your typing speed is around average!"
    } else return "You type slower than my granny!";
}

//CODE
generateRows();
set_cursor(currentWord, currentLetter);
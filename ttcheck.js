// https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1061969/2018_MTC_assessment_framework_PDFA_updated_for_2022.pdf

const nrOfQuestions = 25;
const delayQuestion = 6;
const delayPause = 3;
var currentIndex = 0;
var timerID;
var timerPauseID;

const questions = new Array(nrOfQuestions);
const minNrOfItems = [3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 9, 11, 12];
const maxNrOfItems = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12];

const startBtn = document.getElementById("startBtn");

const settingsDiv = document.getElementById("settings");

const startDiv = document.getElementById("start");

const testDiv = document.getElementById("test");
const timerDiv = document.getElementById("timer");
const calcLb = document.getElementById("calcLb");
const calcRes = document.getElementById("calcRes");
const nextBtn = document.getElementById("nextBtn");

const pauseDiv = document.getElementById("pause");

const resultDiv = document.getElementById("result");
const overAllResultDiv = document.getElementById("overAllResult");
const questionsResultDiv = document.getElementById("questionsResult");
const endBtn = document.getElementById("endBtn");


function init() {
    setVisibility(startDiv, true);
    setVisibility(testDiv, false);
    setVisibility(resultDiv, false);
    setVisibility(pauseDiv, false);
    setVisibility(nextBtn, false);
}

function initTest() {
    setVisibility(startDiv, false);
    setVisibility(testDiv, true);
    setVisibility(resultDiv, false);
    setVisibility(pauseDiv, false);

    setQuestions();
    currentIndex = 0;
    askQuestion();
}

function setQuestions() {
    //Generate unique multiplication questions
    let allQuestions = {
        2: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        3: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        4: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        5: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        6: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        7: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        8: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        9: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        10: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        11: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        12: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    };
    let currMaxNrOfItems = maxNrOfItems;
    let i = 0;
    for (i; i < minNrOfItems.length; i++) {
        let num1 = minNrOfItems[i];

        let randIndex = getRandomNumber(0, allQuestions[num1].length - 1);
        let num2 = allQuestions[num1][randIndex];
        allQuestions[num1].splice(randIndex, 1);

        questions[i] = [num1, num2, 0];
    }
    for (i; i < nrOfQuestions; i++) {
        let randIndex1 = getRandomNumber(0, currMaxNrOfItems.length - 1);
        let num1 = currMaxNrOfItems[randIndex1];
        currMaxNrOfItems.splice(randIndex1, 1);

        let randIndex2 = getRandomNumber(0, allQuestions[num1].length - 1);
        let num2 = allQuestions[num1][randIndex2];
        allQuestions[num1].splice(randIndex2, 1);

        questions[i] = [num1, num2, 0];
    }
    shuffleQuestions();
}

/*
function setQuestions2() {
    //Only for testing - fill up the questions array with random numerbs between 2 and 12
    for (let i = 0; i < nrOfQuestions; i++) {
        let num1 = getRandomNumber(2, 12);
        let num2 = getRandomNumber(2, 12);
        questions[i] = [num1, num2, 0];
    }
}
*/

function shuffleQuestions() {
    //Randomize the questions with Fisher-Yates (Knuth) Shuffle
    for (let i = 0; i < questions.length - 1; i++) {
        let j = getRandomNumber(i, questions.length - 1);
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

function getRandomNumber(minNr, maxNr) {
    //returns a random number between 2 and 12
    return Math.floor(Math.random() * (maxNr - minNr + 1) + minNr);
}

function askQuestion() {
    if (currentIndex < questions.length) {
        showQuestion();
        setAndStartTimer(delayQuestion);

    } else {
        clearInterval(timerID);
        showResults();
    }
}

function showQuestion() {
    //console.log(`question: ${currentIndex}`);
    setVisibility(pauseDiv, false);
    calcRes.value = "";
    let nr1 = questions[currentIndex][0];
    let nr2 = questions[currentIndex][1];
    calcLb.innerText = `${nr1} x ${nr2}=`;
    timerDiv.innerHTML = `Time Left: ${delayQuestion}`;
    setVisibility(testDiv, true);
    calcRes.focus();
    calcRes.scrollIntoView();
}

function setAndStartTimer(time) {
    timerID = setInterval(timer, 1000);

    function timer() {
        timerDiv.innerHTML = `Time Left: ${time}`;
        time--;
        if (time < 0) {
            saveResultAndStartPause()
            //setAndStartPause(delayPause);
            //clearInterval(timerID);
        }
    }
}

function setAndStartPause(time) {
    timerPauseID = setInterval(pauseTimer, 1000);
    function pauseTimer() {
        time--;
        setVisibility(testDiv, false);
        let nextQuestion = currentIndex + 1;
        pauseDiv.innerHTML = `Question ${nextQuestion} ...`;
        setVisibility(pauseDiv, true);

        //console.log(`Pause`)
        if (time < 0) {
            clearInterval(timerPauseID);
            //saveAndMoveNextQuestion();
            askQuestion();
        }
    }
}

function saveAndMoveNextQuestion() {
    //saveCurrentResult(currentIndex);
    //currentIndex++;
    //askQuestion();
}

calcRes.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
        if (isValidAnswer()) {
            saveResultAndStartPause()
            //setAndStartPause(delayPause);
            //clearInterval(timerID);
            //saveAndMoveNextQuestion();
        }
    }
})

function saveResultAndStartPause(){
    saveCurrentResult();
    currentIndex++;
//    console.log(timerID);
    clearInterval(timerID);
    if (currentIndex < questions.length){
        setAndStartPause(delayPause);
    } else {
        askQuestion();
    }
    
}

function saveCurrentResult() {
    questions[currentIndex][2] = (isValidAnswer()) ? calcRes.value : 0;  
}

function isValidAnswer() {
    return (calcRes.value.length != 0);
}

function showResults() {
    setVisibility(pauseDiv, false);
    setVisibility(testDiv, false);
    clearResultDiv();

    //console.log(questions);

    let nrOfCorrectAnswer = 0;
    for (let i = 0; i < questions.length; i++) {

        let currQuestionData = questions[i];
        let curResult = document.createElement("div");
        curResult.innerText = `${currQuestionData[0]} x ${currQuestionData[1]} = ${currQuestionData[2]}`
        if (currQuestionData[0] * currQuestionData[1] == currQuestionData[2]) {
            curResult.style.color = "green";
            nrOfCorrectAnswer++;
        } else {
            curResult.style.color = "red";
        }
        questionsResultDiv.appendChild(curResult);
    }
    overAllResultDiv.innerText = `Your result is: ${nrOfCorrectAnswer} \\ ${nrOfQuestions}`;
    setVisibility(resultDiv, true);
}

function clearResultDiv() {
    while (questionsResultDiv.firstChild) {
        questionsResultDiv.removeChild(questionsResultDiv.lastChild);
    }
}

startBtn.addEventListener("click", function () {
    initTest();
});

endBtn.addEventListener("click", function () {
    init();
});


/*
nextBtn.addEventListener("click", function () {
    console.log(`currQuestion ${currQuestion}`);
});
*/


function setVisibility(item, isVisible) {
    if (isVisible) {
        item.style.visibility = "visible";
    } else {
        item.style.visibility = "hidden";
    }
}

init();

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const choiceList = document.getElementById("choices-list");
  const resultContainer = document.getElementById("result-container");
  const scoreDisplay = document.getElementById("score");
  const skip = document.getElementById("skip");
  const questions = [
    {
      question: "What is the largest planet in our solar system?",
      choices: ["Earth", "Mars", "Jupiter", "Venus"],
      answer: "Jupiter",
      marks: 1,
    },
    {
      question: "Who wrote the play 'Romeo and Juliet'?",
      choices: [
        "William Shakespeare",
        "Charles Dickens",
        "Leo Tolstoy",
        "Jane Austen",
      ],
      answer: "William Shakespeare",
      marks: 2,
    },
    {
      question: "What is the chemical symbol for water?",
      choices: ["O2", "H2O", "CO2", "HO"],
      answer: "H2O",
      marks: 1,
    },
    {
      question: "What is the capital of Japan?",
      choices: ["Tokyo", "Beijing", "Seoul", "Bangkok"],
      answer: "Tokyo",
      marks: 2,
    },
    {
      question: "Which animal is known as the 'King of the Jungle'?",
      choices: ["Tiger", "Elephant", "Lion", "Giraffe"],
      answer: "Lion",
      marks: 3,
    },
  ];
  let currentQuestionIndex = 0;
  let score = 0;
  let total = 0;
  let prevchoice;
  questions.forEach((question) => {
    total += question.marks;
  });

  startBtn.addEventListener("click", startQuiz);

  nextBtn.addEventListener("click", () => {
    if (prevchoice === questions[currentQuestionIndex].answer) {
      score = score + questions[currentQuestionIndex].marks;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  });
  skip.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  });
  restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add("hidden");
    startQuiz();
  });
  function startQuiz() {
    startBtn.classList.add("hidden");
    resultContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    showQuestion();
  }
  function showQuestion() {
    nextBtn.classList.add("hidden");
    questionText.textContent = questions[currentQuestionIndex].question;
    choiceList.innerHTML = ""; //clear previous choices
    questions[currentQuestionIndex].choices.forEach((choice) => {
      const li = document.createElement("li");
      li.textContent = choice;
      li.addEventListener("click", () => selectAnswer(choice, li));
      choiceList.appendChild(li);
    });
  }
  function selectAnswer(choice, li) {
    choiceList.querySelectorAll("li").forEach((l) => {
      if (l.classList.contains("choiceSelect")) {
        l.classList.remove("choiceSelect");
      }
    });
    prevchoice = choice;

    li.classList.add("choiceSelect");

    nextBtn.classList.remove("hidden");
  }

  function showResult() {
    questionContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    scoreDisplay.textContent = `${score} out of ${total}`;
  }
});

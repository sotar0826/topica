// /quiz/ 横断一問一答。バニラJS・localStorage不使用。
// データは quiz.astro が #quiz-data に埋め込んだJSON（src/data/quiz.json をビルド時に
// 機械抽出したもの。scripts/gen-quiz.mjs 参照）を読み込んで使う。
// フロー: 科目選択 → 開始 → ランダム10問を1問ずつ出題 → ○/×回答 → 即時正誤・解説表示
//         → 次へ → 10問終了で結果画面（正答数・間違えた問題の記事リンク） → もう一度
(function () {
  var dataEl = document.getElementById("quiz-data");
  if (!dataEl) return;

  var ALL_QUESTIONS = [];
  try {
    ALL_QUESTIONS = JSON.parse(dataEl.textContent || "[]");
  } catch (e) {
    ALL_QUESTIONS = [];
  }

  var QUIZ_LENGTH = 10;

  var setupEl = document.getElementById("quiz-setup");
  var playEl = document.getElementById("quiz-play");
  var finishEl = document.getElementById("quiz-finish");
  if (!setupEl || !playEl || !finishEl) return;

  var subjectSelect = document.getElementById("quiz-subject");
  var startBtn = document.getElementById("quiz-start");
  var setupNote = document.getElementById("quiz-setup-note");

  var progressText = document.getElementById("quiz-progress-text");
  var progressFill = document.getElementById("quiz-progress-fill");
  var subjectTag = document.getElementById("quiz-subject-tag");
  var questionEl = document.getElementById("quiz-question");
  var answerButtonsEl = document.getElementById("quiz-answer-buttons");
  var resultEl = document.getElementById("quiz-result");
  var resultMarkEl = document.getElementById("quiz-result-mark");
  var explanationEl = document.getElementById("quiz-explanation");
  var sourceLink = document.getElementById("quiz-source-link");
  var nextBtn = document.getElementById("quiz-next");

  var scoreEl = document.getElementById("quiz-score");
  var wrongWrap = document.getElementById("quiz-wrong-wrap");
  var wrongListEl = document.getElementById("quiz-wrong-list");
  var retryBtn = document.getElementById("quiz-retry");

  var state = {
    questions: [],
    index: 0,
    correctCount: 0,
    wrong: [],
  };

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function pickQuestions(subject) {
    var pool = subject === "all" ? ALL_QUESTIONS : ALL_QUESTIONS.filter(function (q) {
      return q.subject === subject;
    });
    var shuffled = shuffle(pool);
    return shuffled.slice(0, Math.min(QUIZ_LENGTH, shuffled.length));
  }

  function showView(view) {
    setupEl.hidden = view !== "setup";
    playEl.hidden = view !== "play";
    finishEl.hidden = view !== "finish";
  }

  function startQuiz() {
    var subject = subjectSelect.value;
    var questions = pickQuestions(subject);
    if (questions.length === 0) {
      setupNote.textContent = "この科目の問題がまだありません。";
      return;
    }
    setupNote.textContent = "";
    state.questions = questions;
    state.index = 0;
    state.correctCount = 0;
    state.wrong = [];
    showView("play");
    renderQuestion();
  }

  function renderQuestion() {
    var q = state.questions[state.index];
    resultEl.hidden = true;
    answerButtonsEl.hidden = false;
    subjectTag.textContent = q.subjectName;
    questionEl.textContent = q.question;
    progressText.textContent = (state.index + 1) + " / " + state.questions.length + "問";
    var pct = Math.round((state.index / state.questions.length) * 100);
    progressFill.style.width = pct + "%";
  }

  function answerQuestion(userAnswer) {
    var q = state.questions[state.index];
    var correct = userAnswer === q.answer;
    if (correct) {
      state.correctCount++;
    } else {
      state.wrong.push(q);
    }

    answerButtonsEl.hidden = true;
    resultEl.hidden = false;
    resultMarkEl.textContent = (correct ? "○ 正解" : "× 不正解") + "（答え：" + (q.answer ? "○" : "×") + "）";
    resultMarkEl.className = "quiz-result-mark " + (correct ? "is-correct" : "is-wrong");
    explanationEl.textContent = q.explanation;
    sourceLink.href = "/" + q.subject + "/" + q.topicSlug + "/";
    sourceLink.textContent = q.subjectName + "「" + q.topicTitle + "」を読む →";
  }

  function nextQuestion() {
    state.index++;
    if (state.index >= state.questions.length) {
      finishQuiz();
      return;
    }
    renderQuestion();
  }

  function finishQuiz() {
    showView("finish");
    scoreEl.textContent = state.correctCount + " / " + state.questions.length + "問 正解";
    wrongListEl.innerHTML = "";
    if (state.wrong.length > 0) {
      wrongWrap.hidden = false;
      state.wrong.forEach(function (q) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "/" + q.subject + "/" + q.topicSlug + "/";
        a.textContent = q.subjectName + "「" + q.topicTitle + "」";
        li.appendChild(a);
        var p = document.createElement("p");
        p.className = "quiz-wrong-question";
        p.textContent = q.question;
        li.appendChild(p);
        wrongListEl.appendChild(li);
      });
    } else {
      wrongWrap.hidden = true;
    }
  }

  startBtn.addEventListener("click", startQuiz);
  retryBtn.addEventListener("click", function () {
    showView("setup");
  });
  nextBtn.addEventListener("click", nextQuestion);

  answerButtonsEl.querySelectorAll("[data-answer]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      answerQuestion(btn.getAttribute("data-answer") === "true");
    });
  });

  // JS有効時のみ操作UIを表示する（プログレッシブエンハンスメント）
  if (ALL_QUESTIONS.length > 0) {
    setupEl.hidden = false;
  }
})();

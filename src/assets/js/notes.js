function notesHideShow() {
  function hideAnswers() {
    let answers = document.querySelectorAll("#notes .faq .a");

    // make answers invesible
    answers.forEach(answer => {
      answer.style.height = "0";
    });
  }

  function makeQuestionShowItsAnswer() {
    let questions = document.querySelectorAll("#notes .faq .q");

    // click question to show the answer
    questions.forEach(question => {
      question.addEventListener("click", function() {
        hideAnswers();
        let answer = question.nextElementSibling;
        let height = answer.style.height;
        answer.style.height = height ? "" : 0;
      });
    });
  }

  hideAnswers();
  makeQuestionShowItsAnswer();
}

function dynamicUTorrntLink() {
  let android =
    "https://play.google.com/store/apps/details?id=com.utorrent.client";
  let windows = "https://www.utorrent.com/downloads/win";
  let pcMinWidth = 500;
  let a = document.querySelector('a[href*="utorrent"]');

  if (window.innerWidth < pcMinWidth) {
    a.href = android;
  } else {
    a.href = windows;
  }
}

function handleNotes() {
  notesHideShow();
  dynamicUTorrntLink();
}

document.addEventListener("DOMContentLoaded", function(e) {
  handleNotes();
});

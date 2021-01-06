const QUIZMO = JSON.parse(localStorage.getItem('QUIZMO')) || {};

if (QUIZMO.scores) {
  const highScoreButton = document.querySelector('.highscore');
  const highScoreModal = document.querySelector('[highscore]');
  const highScoresTable = document.querySelector('.highScoresList tbody');
  highScoreButton.removeAttribute('disabled');

  highScoresTable.innerHTML = QUIZMO.scores.map(userObject => {
    return `<tr>
      <td>${userObject.username}</td>
      <td>${userObject.score}</td>
      <td>${userObject.maxPossibleScore}</td>
    </tr>`
  }).join('');

  highScoreButton.addEventListener('click', () => {
    highScoreModal.classList.add('active');
    highScoreModal.closest('.modal-overlay').classList.add('active');
  
    highScoreModal.querySelector('.close-modal').addEventListener('click', () => {
      highScoreModal.classList.remove('active');
      highScoreModal.closest('.modal-overlay').classList.remove('active');
    })
  })
}
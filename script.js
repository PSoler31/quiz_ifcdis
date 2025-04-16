let actionBtn = document.getElementById('actionButton');
let video = document.getElementById('timerVideo');
let timer = null;
let currentPoints = 5;
let elapsedSeconds = 0;
let gameState = "start"; // start, buzz, next

// Fonction pour déterminer les points en fonction du temps écoulé
function calculatePoints(sec) {
  if (sec < 6) return 5;
  if (sec < 12) return 4;
  if (sec < 18) return 3;
  if (sec < 24) return 2;
  return 1;
}

// Définitl'attribution des points en fonction du timing du jeu [modifié]
function startTimer() {
  elapsedSeconds = 0;
  currentPoints = 5;
}

function updatePointsInSync() {
  if (!video.paused && !video.ended) {
    const seconds = Math.floor(video.currentTime);
    currentPoints = calculatePoints(seconds);
    // tu peux même afficher les points ici si tu veux les rendre visibles à l'écran
  }

  requestAnimationFrame(updatePointsInSync);
}


// Arrêter le timer et la vidéo
function stopTimer() {
  clearInterval(timer);
  timer = null;
  video.pause();
}

// Gestion du bouton principal
actionBtn.addEventListener('click', () => {
if (gameState === "start") {
  actionBtn.textContent = "BUZZ !";

  video.currentTime = 0;
  video.style.display = "block";

  // Ajoute la classe d'animation
  video.classList.add("animate");

  // Forcer le relancement si besoin
  void video.offsetWidth; // Trick pour forcer l’animation à se rejouer
  video.classList.remove("animate"); // Reset après une tick
  setTimeout(() => {
    video.classList.add("animate");
  }, 10);

  video.play();
  startTimer();
  gameState = "buzz";

  } else if (gameState === "buzz") {
    stopTimer();
    actionBtn.textContent = "Question suivante";
    gameState = "next";

    let msgBox = document.getElementById('messageBox');
    msgBox.textContent = "Choisis un joueur à qui donner les " + currentPoints + " points.";
    msgBox.style.display = 'block';
    
    setTimeout(() => {
      msgBox.style.display = 'none';
    }, 3000); // disparaît au bout de 3 secondes

  } else if (gameState === "next") {
    actionBtn.textContent = "BUZZ !";
    video.currentTime = 0;
    video.play();
    startTimer();
    gameState = "buzz";
  }
});

// Génération dynamique des joueurs depuis le localStorage
function setupPlayers() {
  const playerData = JSON.parse(localStorage.getItem('players')) || {
    player1: "Joueur 1",
    player2: "Joueur 2",
    player3: "Joueur 3",
    player4: "Joueur 4"
  };

  const playerList = document.getElementById('players');
  Object.entries(playerData).forEach(([key, name]) => {
    const div = document.createElement('div');
    div.className = "player";
    div.dataset.name = name;
    div.innerHTML = `${name} : <span class="score">0</span>`;
    playerList.appendChild(div);

    div.addEventListener('click', () => {
      let scoreEl = div.querySelector('.score');
      let current = parseInt(scoreEl.textContent);
      scoreEl.textContent = current + currentPoints;

      stopTimer();
    });
  });
}

// Lancer la génération des joueurs à l'ouverture
window.addEventListener("DOMContentLoaded", () => {
  updatePointsInSync();
  setupPlayers();
});


// bouton de mauvaise réponse affichage
const buzzBtn = document.getElementById ('actionButton')
const mauvaise_rep = document.getElementById ('bouton_mauvaise_reponse')

buzzBtn.addEventListener('click', () => {
  if (buzzBtn.textContent.trim() === 'Question suivante'){
    mauvaise_rep.style.display = 'inline-block'; //affiche le bouton suite. 
  }

})

mauvaise_rep.addEventListener('click', () => {
  // Reprendre la vidéo là où elle s'était arrêtée
  video.play();

  // Relancer le timer si nécessaire (si timer = null, on le redémarre)
  if (!timer) {
    timer = setInterval(() => {
      elapsedSeconds++;
      currentPoints = calculatePoints(elapsedSeconds);
      if (elapsedSeconds >= 30) {
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  }

  // Changer le texte du bouton BUZZ s’il a été modifié
  buzzBtn.textContent = "BUZZ !";
  gameState = "buzz";


  // Réafficher le bouton BUZZ
  buzzBtn.style.display = 'inline-block';

  // Cacher le bouton mauvaise réponse
  mauvaise_rep.style.display = 'none';
});

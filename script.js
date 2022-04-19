const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Добавляем картинки
const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeTop = new Image();
const pipeBottom = new Image();

bird.src = 'img/bird.png';
bg.src = 'img/bg.png';
fg.src = 'img/fg.png';
pipeTop.src = 'img/pipeTop.png';
pipeBottom.src = 'img/pipeBottom.png';

// Аудио файлы
const fly = new Audio();
const score_audio = new Audio();

fly.src = 'audio/fly.mp3';
score_audio.src = 'audio/score.mp3';

// Расстояние между блоками
const gap = 90;

// Текущий счёт
let score = 0;

// Создание блоков
const pipe = [];
pipe[0] = {
  x: canvas.width,
  y: 0,
};

// Проверка на готовность
let bool = false;
const btn = document.getElementById('start');
btn.addEventListener('click', () => {
  bool = true;
  btn.remove();
});

// Получаем рекордный счёт
const storage = localStorage.getItem('count');
!storage && localStorage.setItem('count', 0);

// При нажатие кнопки взлетает на вверх
document.addEventListener('keydown', moveUp);
document.addEventListener('touchstart', moveUp);

function moveUp() {
  if (bool) {
    for (let i = 0; i < 26; i++) {
      setTimeout(() => {
        yPos -= 1;
      }, 120);
    }
    fly.play();
  }
}

// Позиция птички
let xPos = 10;
let yPos = 150;
let grav = 1.5;

// Отрисовка картинок
function draw() {
  ctx.drawImage(bg, 0, 0);

  if (bool) {
    move();
  }

  console.log();

  ctx.drawImage(fg, 0, canvas.height - fg.height);

  ctx.drawImage(bird, xPos, yPos);

  ctx.fillStyle = '#000';
  ctx.font = '20px Verdana';
  ctx.fillText('Счет: ' + score, 10, canvas.height - 80);
  ctx.fillText('Рекорд: ' + storage, 10, canvas.height - 40);

  requestAnimationFrame(draw);
}

pipeBottom.onload = draw;

function move() {
  for (let i = 0; i < pipe.length; i++) {
    ctx.drawImage(pipeTop, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeTop.height + gap);

    pipe[i].x--;

    if (pipe[i].x == 125) {
      pipe.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeTop.height) - pipeTop.height,
      });
    }

    // Проверка столкновение
    if (
      (xPos + bird.width >= pipe[i].x &&
        xPos <= pipe[i].x + pipeTop.width &&
        (yPos <= pipe[i].y + pipeTop.height ||
          yPos + bird.height >= pipe[i].y + pipeTop.height + gap)) ||
      yPos + bird.height >= canvas.height - fg.height
    ) {
      localStorage.setItem('count', score >= storage ? score : storage);
      bool = false;
      location.reload();
    }

    // Добавление очков
    if (pipe[i].x == 5) {
      score++;
      score_audio.play();
      if (pipe.length > 2) {
        pipe.shift();
      }
    }
  }

  yPos += grav;
}

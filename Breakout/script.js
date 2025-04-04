jQuery(() => {
  // ********** BUTTON CLOSE MECHANIC **********
  $("#how-to-play button").on('click',(function () {
    $("#how-to-play")
      .removeClass("moving-div-right")
      .addClass("moving-div-left");
  }));
  $("#rule").on('click',(function () {
    $("#how-to-play")
      .removeClass("moving-div-left")
      .addClass("moving-div-right");
  }));

  // ********** GAME MECHANIC **********

  // Starting canvas settings
  const canvas = document.querySelector("canvas");
  const c = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;

  // Global score variable
  let score = 0;

  // ********** CLASSES **********
  class Ball {
    constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      const minSpeed = 1;
      const maxSpeed = 1.5;

      // Randomize dx and dy within the lower speed range
      this.dx =
        (Math.random() * (maxSpeed - minSpeed) + minSpeed) *
        (Math.random() > 0.5 ? 1 : -1);
      this.dy =
        (Math.random() * (maxSpeed - minSpeed) + minSpeed) *
        (Math.random() > 0.5 ? 1 : -1);

      // Ensure the ball always starts moving upward (dy negative)
      if (this.dy > 0) {
        this.dy = -this.dy;
      }
    }
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
      c.closePath();
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      // Bounce off the left/right walls
      if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }
      // Bounce off the top/bottom walls
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }
      this.draw();
    }
  }

  class PlayerPlatform {
    constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
    }
    draw() {
      c.beginPath();
      c.fillStyle = this.color;
      c.fillRect(this.x, this.y, this.width, this.height);
    }
    move(direction) {
      const speed = 10;
      if (direction === "left" && this.x > 0) {
        this.x -= speed;
      } else if (direction === "right" && this.x + this.width < canvas.width) {
        this.x += speed;
      }
    }
  }

  // ********** LISTS **********

  let walls = [];

  // ********** FUNCTIONS **********

  function restart() {
    // Reinitialize the ball position and speed
    const minSpeed = 1;
    const maxSpeed = 1.5;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() > 0.5 ? 1 : -1);

    // Reinitialize the player platform position
    playerPlatform.x = canvas.width / 2 - playerPlatform.width / 2;

    // Reinitialize score and reset the walls
    score = 0;
    initializeWalls();

    // Reset game running state and start the game loop
    gameRunning = true;
    gameLoop();
  }


  function initializeWalls() {
    const wallWidth = 80;
    const wallHeight = 20;
    const wallColor = "blue";
    const columns = 8;
    const rows = 4;
    walls = [];
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const finalX = column * (wallWidth + 18) + 15;
        const finalY = row * (wallHeight + 10) + 30;
        walls.push({
          x: finalX,
          y: finalY,
          width: wallWidth,
          height: wallHeight,
          color: wallColor,
        });
      }
    }
  }

  function renderWalls() {
    walls.forEach((wall) => {
      c.fillStyle = wall.color;
      c.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
  }

  function checkIfBallHitWalls() {
    walls.forEach((wall, i) => {
      if (
        ball.x + ball.radius > wall.x &&
        ball.x - ball.radius < wall.x + wall.width &&
        ball.y + ball.radius > wall.y &&
        ball.y - ball.radius < wall.y + wall.height
      ) {
        ball.dy = -ball.dy;
        walls.splice(i, 1);
        score += 1;
      }
    });
  }

  function checkIfBallHitPlayer() {
    if (
      ball.x + ball.radius > playerPlatform.x &&
      ball.x - ball.radius < playerPlatform.x + playerPlatform.width &&
      ball.y + ball.radius > playerPlatform.y &&
      ball.y - ball.radius < playerPlatform.y + playerPlatform.height
    ) {

      let hitPoint = (ball.x - playerPlatform.x) / playerPlatform.width;
      let angleView = (hitPoint - 0.5) * (Math.PI / 3);
      let speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
      ball.dx = speed * Math.sin(angleView);
      ball.dy = -Math.abs(speed * Math.cos(angleView)); // Ensure it always moves up
    }
  }

  // Draw the scoreboard
  function drawScore() {
    c.font = "20px Arial";
    c.fillStyle = "black";
    c.textAlign = "left";
    c.fillText("Score: " + score, 20, 20);
  }

  // ********** GAME LOOP **********
  initializeWalls();
  let gameRunning = true;
  function gameLoop() {
    if (!gameRunning) return;
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Win condition: if all walls are destroyed
    if (walls.length === 0) {
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.font = "bold 60px Arial";
      c.fillStyle = "gold";
      c.textAlign = "center";
      c.fillText("You Win!", canvas.width / 2, canvas.height / 2);
      gameRunning = false;
      return;
    }

    renderWalls();
    playerPlatform.draw();
    ball.update();
    drawScore();

    // Game Over: if ball hits the bottom
    if (ball.y + ball.radius >= canvas.height) {
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.font = "bold 60px Arial";
      c.fillStyle = "red";
      c.textAlign = "center";
      c.fillText("You Lost!", canvas.width / 2, canvas.height / 2);
      gameRunning = false;
      return;
    }
    checkIfBallHitWalls();
    checkIfBallHitPlayer();

    requestAnimationFrame(gameLoop);
  }

  // Create the ball in the middle of the canvas
  const mainBallX = canvas.width / 2;
  const mainBallY = canvas.height / 2;
  const ball = new Ball(mainBallX, mainBallY, 10, "blue");

  // Create the player platform
  const playerX = (canvas.width - 100) / 2;
  const playerPlatform = new PlayerPlatform(playerX, 550, 100, 20, "green");

  // Listen for player movement
  document.addEventListener("keydown", (event) => {
    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
      playerPlatform.move("right");
    } else if (
      event.key === "a" ||
      event.key === "A" ||
      event.key === "ArrowLeft"
    ) {
      playerPlatform.move("left");
    }
  });
  //check if player wants a restart
  canvas.addEventListener("click", () => {
    if (!gameRunning) {
      restart();
    }
  });

  // ********** MOBILE TOUCH CONTROLS **********
  let touchStartX = 0;
  let touchEndX = 0;

  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
  }

  function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        playerPlatform.move("right");
      } else {
        playerPlatform.move("left");
      }
      touchStartX = touchEndX;
    }
  }

  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchmove", handleTouchMove);


  // Start the game loop
  gameLoop();
});

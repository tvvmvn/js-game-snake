(function () {
  /* struct */

  class Snake {
    constructor(x, y, m, size, movingPoint, moved, node, dir, color) {
      this.x = x;
      this.y = y;
      this.m = m;
      this.size = size;
      this.movingPoint = movingPoint;
      this.moved = moved;
      this.node = node;
      this.dir = dir;
      this.color = color;
    }
  }

  class Apple {
    constructor(x, y, radius, count, eaten, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.count = count;
      this.eaten = eaten;
      this.color = color;
    }
  }

  /* enums */

  const Direction = {
    UP: 0,
    LEFT: 1,
    RIGHT: 2,
    DOWN: 3
  }

  const Key = {
    UP: "ArrowUp",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    DOWN: "ArrowDown",
    ENTER: "Enter"
  }

  const Stage = {
    OFFSET_X: 20,
    OFFSET_Y: 60,
    WIDTH: 460,
    HEIGHT: 340,
    CELL: 20,
  }

  /* variables */

  var ctx = canvas.getContext("2d");
  var snake;
  var apple;
  var time;
  var game;
  var prevX;
  var prevY;
  var prevDir;
  var checker = [];
  var start = false;

  for (var r = 0; r < Stage.HEIGHT / Stage.CELL; r++) {
    checker[r] = [];

    for (var c = 0; c < Stage.WIDTH / Stage.CELL; c++) {
      if ((r + c) % 2) {
        checker[r][c] = 1;
      } else {
        checker[r][c] = 0;
      }
    }
  }

  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.backgroundColor = "#222";
  addEventListener("keydown", keyDownHandler);

  /* run the game */

  setInterval(run, 10); // 100hz

  function run() {
    clearCanvas();
    drawTitle();
    drawStage();

    // Start screen
    if (!start) {
      initialize();
      drawMessage("Press any key to start game");
      return;
    }

    if (game.over || game.end) {
      if (game.over) {
        drawMessage("GAME OVER");
      }
  
      if (game.end) {
        drawMessage("YOU WIN!");
      }
    } else {
      setSnake();
      setApple();
      setTime();
    }

    drawApple();
    drawSnake();
    drawTime();
    drawScore();
  }

  function initialize() {
    snake = new Snake(
      Stage.OFFSET_X + (Stage.CELL * 2), Stage.OFFSET_Y,
      0,
      Stage.CELL,
      20,
      true,
      [
        [Stage.OFFSET_X + (Stage.CELL * 2), Stage.OFFSET_Y],
        [Stage.OFFSET_X + (Stage.CELL * 1), Stage.OFFSET_Y],
        [Stage.OFFSET_X, Stage.OFFSET_Y]
      ],
      Direction.RIGHT,
      "#0bf"
    );

    apple = new Apple(
      Stage.OFFSET_X + 100, Stage.OFFSET_Y + 100,
      10,
      20,
      false,
      "#0b0"
    )

    time = {
      _s: 0,
      s: 0,
    };

    game = {
      over: false,
      end: false
    }

    prevX = snake.x;
    prevY = snake.y;
  }

  /* functions */

  // Snake
  function setSnake() {
    snake.m++;

    if (prevDir !== snake.dir) {
      snake.m += snake.movingPoint;
    }
    
    if (snake.m > snake.movingPoint) {
      if (snake.dir == Direction.RIGHT) {
        snake.x += Stage.CELL;
      }
      if (snake.dir == Direction.DOWN) {
        snake.y += Stage.CELL;
      }
      if (snake.dir == Direction.LEFT) {
        snake.x -= Stage.CELL;
      }
      if (snake.dir == Direction.UP) {
        snake.y -= Stage.CELL;
      }
    }

    if (prevX !== snake.x || prevY !== snake.y) {
      snake.m = 0;
      
      if (wallCrash()) {
        game.over = true;
      } else if (selfCrash()) {
        game.over = true;
      } else { // movement
        // body
        for (var j = snake.node.length - 1; j > 0; j--) {
          snake.node[j][0] = snake.node[j - 1][0];
          snake.node[j][1] = snake.node[j - 1][1];
        }
        // head
        snake.node[0][0] = snake.x;
        snake.node[0][1] = snake.y;

        // crds update of each node has been completed, so
        snake.moved = true;
      }
    }

    prevX = snake.x;
    prevY = snake.y;
    prevDir = snake.dir;
  }

  function selfCrash() {
    var value = false;

    for (var h = 3; h < snake.node.length; h++) {
      if (snake.x == snake.node[h][0] && snake.y == snake.node[h][1]) {
        value = true;
      }
    }

    return value;
  }

  function wallCrash() {
    var leftCrash = snake.x < Stage.OFFSET_X
    var rightCrash = snake.x + Stage.CELL > Stage.OFFSET_X + Stage.WIDTH;
    var topCrash = snake.y < Stage.OFFSET_Y;
    var bottomCrash = snake.y + Stage.CELL > Stage.OFFSET_Y + Stage.HEIGHT;

    if (leftCrash || rightCrash || topCrash || bottomCrash) {
      return true
    }

    return false;
  }
  
  // Apple
  function setApple() {
    if (apple.count) {
      apple.eaten = (snake.x == apple.x) && (snake.y == apple.y)

      if (apple.eaten) {
        snake.node.push([snake.x, snake.y]);
        apple.count--;
        putApple();
        snake.movingPoint--;
      }
    } else {
      game.end = true;
    }
  }

  function putApple() {
    var x = Stage.OFFSET_X + (Stage.CELL * (Math.floor(Math.random() * 20)));
    var y = Stage.OFFSET_Y + (Stage.CELL * (Math.floor(Math.random() * 15)));

    var putAgain = false;

    // detect apple on snake body
    for (var i = 0; i < snake.node.length; i++) {
      if (snake.node[i][0] == x && snake.node[i][1] == y) {
        putAgain = true;
      }
    }

    if (putAgain) {
      putApple()
    } else {
      apple.x = x
      apple.y = y
    }
  }

  // Time
  function setTime() {
    time._s++

    if (time._s > 100) {
      time.s++;
      time._s = 0;
    }
  }

  /* draw */

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  function drawStage() {
    // checker
    ctx.fillStyle = "#333";

    for (var r = 0; r < checker.length; r++) {
      for (var c = 0; c < checker[r].length; c++) {
        if (checker[r][c]) {
          ctx.fillRect(
            Stage.OFFSET_X + (Stage.CELL * c),
            Stage.OFFSET_Y + (Stage.CELL * r),
            Stage.CELL, Stage.CELL);
        }
      }
    }

    // border
    ctx.beginPath();
    ctx.strokeStyle = "#ddd";
    ctx.rect(Stage.OFFSET_X, Stage.OFFSET_Y, Stage.WIDTH, Stage.HEIGHT);
    ctx.stroke();
  }

  function drawSnake() {
    for (var i = 0; i < snake.node.length; i++) {
      ctx.fillStyle = snake.color;
      ctx.fillRect(snake.node[i][0], snake.node[i][1], snake.size, snake.size);
    }
  }

  function drawApple() {
    ctx.beginPath();
    ctx.arc(
      apple.x + apple.radius,
      apple.y + apple.radius,
      10,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = apple.color;
    ctx.fill();
  }

  function drawTitle() {
    ctx.font = "20px Monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText("S N A K E", Stage.OFFSET_X + (Stage.WIDTH / 2), 40);
  }

  function drawScore() {
    ctx.font = "16px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.fillText(apple.count + " apples", 390, 50);
  }

  function drawTime() {
    ctx.font = "16px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.fillText("Time: " + time.s, 20, 50);
  }

  function drawMessage(message) {
    ctx.font = "16px Monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(
      message,
      Stage.OFFSET_X + (Stage.WIDTH / 2),
      Stage.OFFSET_Y + ((Stage.HEIGHT + 20) / 2)
    );
  }

  /* control */

  function keyDownHandler(e) {
    var key = e.key; 

    if (!start) {
      start = true;
      return;
    }

    if (game.over || game.end) {
      start = false;
      return;
    }

    if (!snake.moved) return;

    // prevent accel and u-turn 
    if (snake.dir == Direction.RIGHT) {
      if (key == Key.RIGHT || key == Key.LEFT) return;
    }

    if (snake.dir == Direction.DOWN) {
      if (key == Key.DOWN || key == Key.UP) return;
    }

    if (snake.dir == Direction.LEFT) {
      if (key == Key.LEFT || key == Key.RIGHT) return;
    }

    if (snake.dir == Direction.UP) {
      if (key == Key.UP || key == Key.DOWN) return;
    }

    // turn 
    if (key == Key.UP) {
      snake.dir = Direction.UP;
    }

    if (key == Key.LEFT) {
      snake.dir = Direction.LEFT;
    }

    if (key == Key.RIGHT) {
      snake.dir = Direction.RIGHT;
    }

    if (key == Key.DOWN) {
      snake.dir = Direction.DOWN;
    }
    
    snake.moved = false;
  }
})()

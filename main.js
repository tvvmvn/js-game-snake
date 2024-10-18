// canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;
canvas.style.backgroundColor = "#000";

// class
class Snake {
  nodeCount = 5;
  head = "#09f";
  body = "#0bf";
  nodes;
  UNIT;
  dir;
  frame = 0;
  Direction

  constructor(UNIT, CELLS, Direction) {
    this.nodes = new Array(CELLS);
    this.UNIT = UNIT;
    this.Direction = Direction;
    this.dir = Direction.RIGHT;

    // initialize nodes
    for (var i = 0; i < CELLS; i++) {
      this.nodes[i] = [-UNIT, 0];
    }
  }

  selfCollision() {
    for (var i = 1; i < this.nodeCount; i++) {
      if (this.nodes[i][0] == this.nodes[0][0] && this.nodes[i][1] == this.nodes[0][1]) {
        return true;
      }
    }

    return false;
  }

  wallCollision() {
    var leftCrash = this.nodes[0][0] < 0
    var rightCrash = this.nodes[0][0] >= canvas.width;
    var topCrash = this.nodes[0][1] < 0
    var bottomCrash = this.nodes[0][1] >= canvas.height;

    if (leftCrash || rightCrash || topCrash || bottomCrash) {
      return true;
    }

    return false;
  }

  ateApple(appleX, appleY) {
    if (this.nodes[0][0] == appleX && this.nodes[0][1] == appleY) {
      return true;
    }

    return false;
  }

  render() {
    for (var i = 0; i < this.nodeCount; i++) {
      if (i == 0) {
        ctx.fillStyle = this.head;
      } else {
        ctx.fillStyle = this.body;
      }

      ctx.fillRect(this.nodes[i][0], this.nodes[i][1], this.UNIT, this.UNIT);
    }

    // Snake moves per 0.1s
    if (this.frame % 10 == 0) {
      for (var i = this.nodeCount - 1; i > 0; i--) {
        this.nodes[i][0] = this.nodes[i - 1][0];
        this.nodes[i][1] = this.nodes[i - 1][1];
      }
      if (this.dir == this.Direction.RIGHT) {
        this.nodes[0][0] += this.UNIT;
      } else if (this.dir == this.Direction.DOWN) {
        this.nodes[0][1] += this.UNIT;
      } else if (this.dir == this.Direction.LEFT) {
        this.nodes[0][0] -= this.UNIT;
      } else if (this.dir == this.Direction.UP) {
        this.nodes[0][1] -= this.UNIT;
      }
    }

    this.frame++;
  }
}

class Apple {
  x = 100;
  y = 100;
  radius = 10;
  count = 0;
  color = "#0b0";
  UNIT;

  constructor(UNIT) {
    this.UNIT = UNIT;
  }

  updateCrds() {
    this.x = this.UNIT * (Math.floor(Math.random() * 25));
    this.y = this.UNIT * (Math.floor(Math.random() * 20));
  }
  
  render() {
    ctx.beginPath();
    ctx.arc(this.x + this.radius, this.y + this.radius, 10, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Message {
  color = "#fff";

  render(eatenCount) {
    ctx.font = "16px Monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = this.color;
    ctx.fillText(
      "YOU GOT " + eatenCount + " APPLE(S)!",
      (canvas.width / 2),
      ((canvas.height + 20) / 2)
    );
  }
}

class Game {
  UNIT = 20;
  CELLS = (canvas.width * canvas.height) / (this.UNIT * this.UNIT);
  Direction = {
    UP: 0,
    LEFT: 1,
    RIGHT: 2,
    DOWN: 3
  }  
  apple = new Apple(this.UNIT); 
  snake = new Snake(this.UNIT, this.CELLS, this.Direction);
  message = new Message(); 
  eatenCount = 0;
  dir = this.Direction.RIGHT;
  timer;

  constructor() {
    this.timer = setInterval(() => this.actionPerformed(), 10);
  }

  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  actionPerformed() {
    this.clearCanvas();

    // Snake move
    this.snake.render();

    // Snake ate apple
    if (this.snake.ateApple(this.apple.x, this.apple.y)) {
      this.apple.updateCrds();
      this.snake.nodeCount++;
      this.eatenCount++;
    }

    // Game over
    if (this.snake.selfCollision() || this.snake.wallCollision()) {
      this.message.render(this.eatenCount);
      clearInterval(this.timer);
    } 

    // Apple
    this.apple.render();
  }

  keyDownHandler(e) {
    if (e.key == "ArrowDown") {
      if (this.snake.dir != this.Direction.UP) {
        this.snake.dir = this.Direction.DOWN;
      }
    } else if (e.key == "ArrowLeft") {
      if (this.snake.dir != this.Direction.RIGHT) {
        this.snake.dir = this.Direction.LEFT;
      }
    } else if (e.key == "ArrowRight") {
      if (this.snake.dir != this.Direction.LEFT) {
        this.snake.dir = this.Direction.RIGHT;
      }
    } else if (e.key == "ArrowUp") {
      if (this.snake.dir != this.Direction.DOWN) {
        this.snake.dir = this.Direction.UP;
      }
    }
  }
}

var game = new Game();
addEventListener("keydown", (e) => game.keyDownHandler(e));

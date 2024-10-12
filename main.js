// canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
canvas.style.backgroundColor = "#000";

// class
class Snake {
  m = 0;
  movingPoint = 5;
  moved = true;
  nodeCount = 5;
  head = "#09f";
  body = "#0bf";
  collision = false;
  ate = false;
  node;
  UNIT;
  _dir;
  dir;
  Direction;

  constructor(UNIT, CELLS, Direction) {
    this.UNIT = UNIT;
    this.dir = Direction.RIGHT;
    this.node = new Array(CELLS);
    this.Direction = Direction;

    for (var i = 0; i < CELLS; i++) {
      this.node[i] = [0, 0];
    }
  }

  render(appleX, appleY) {
    // draw
    for (var i = 0; i < this.nodeCount; i++) {
      if (i == 0) {
        ctx.fillStyle = this.head;
      } else {
        ctx.fillStyle = this.body;
      }

      ctx.fillRect(this.node[i][0], this.node[i][1], this.UNIT, this.UNIT);
    }

    // handle move
    this.m++;

    if (this._dir != this.dir) {
      this.m += this.movingPoint;
    }

    if (this.m > this.movingPoint) {
      // ate an apple
      if (this.node[0][0] == appleX && this.node[0][1] == appleY) {
        // node +1
        this.nodeCount++;
        this.ate = true;
      }
      
      // one step forward
      for (var i = this.nodeCount - 1; i > 0; i--) {
        this.node[i][0] = this.node[i - 1][0];
        this.node[i][1] = this.node[i - 1][1];
      }
      if (this.dir == this.Direction.RIGHT) {
        this.node[0][0] += this.UNIT;
      } else if (this.dir == this.Direction.DOWN) {
        this.node[0][1] += this.UNIT;
      } else if (this.dir == this.Direction.LEFT) {
        this.node[0][0] -= this.UNIT;
      } else if (this.dir == this.Direction.UP) {
        this.node[0][1] -= this.UNIT;
      }

      // self collision
      for (var i = 1; i < this.nodeCount; i++) {
        if (this.node[i][0] == this.node[0][0] && this.node[i][1] == this.node[0][1]) {
          this.collision = true;
        }
      }

      // wall collision
      var leftCrash = this.node[0][0] < 0
      var rightCrash = this.node[0][0] >= canvas.width;
      var topCrash = this.node[0][1] < 0
      var bottomCrash = this.node[0][1] >= canvas.height;

      if (leftCrash || rightCrash || topCrash || bottomCrash) {
        this.collision = true;
      }

      // initialize gauge 
      this.m = 0;
      // save previous direction
      this._dir = this.dir;
    }
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

  getCrds() {
    return this.UNIT * (Math.floor(Math.random() * 25));
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
  over = false;
  eatenCount = 0;

  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render() {
    this.clearCanvas();
    this.snake.render(this.apple.x, this.apple.y);

    if (this.snake.ate) {
      // update crds of an apple.
      this.apple.x = this.apple.getCrds();
      this.apple.y = this.apple.getCrds();
      this.eatenCount++;
      this.snake.ate = false;
    }

    this.apple.render();
  
    if (this.snake.collision) {
      this.message.render(this.eatenCount);
    } else {
      requestAnimationFrame(() => this.render());
    }
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

game.render();

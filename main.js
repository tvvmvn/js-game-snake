(function () {
  // canvas
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;
  canvas.style.backgroundColor = "#000";
  // constants
  const UNIT = 20;
  const CELLS = (canvas.width * canvas.height) / (UNIT * UNIT);
  const Direction = {
    UP: 0,
    LEFT: 1,
    RIGHT: 2,
    DOWN: 3
  }  

  // class
  class Snake {
    constructor(apple) {
      this.m = 0;
      this.movingPoint = 5;
      this.moved = true;
      this.nodeCount = 5;
      this._dir = Direction.RIGHT;
      this.dir = Direction.RIGHT;
      this.head = "#09f";
      this.body = "#0bf";
      this.crash = false;
      this.ate = false;
      this.apple = apple;

      this.node = new Array(CELLS);
      for (var i = 0; i < CELLS; i++) {
        this.node[i] = [0, 0];
      }
    }

    selfCrash() {
      for (var i = 1; i < this.nodeCount; i++) {
        if (this.node[i][0] == this.node[0][0] && this.node[i][1] == this.node[0][1]) {
          this.crash = true;
        }
      }
    }

    wallCrash() {
      var leftCrash = this.node[0][0] < 0
      var rightCrash = this.node[0][0] >= canvas.width;
      var topCrash = this.node[0][1] < 0
      var bottomCrash = this.node[0][1] >= canvas.height;
  
      if (leftCrash || rightCrash || topCrash || bottomCrash) {
        this.crash = true;
      }
    }

    handleEat() {
      if (this.node[0][0] == this.apple.x && this.node[0][1] == this.apple.y) {
        // node +1
        this.nodeCount++;
        this.apple.getEaten();
      }
    }

    render() {
      // draw
      for (var i = 0; i < this.nodeCount; i++) {
        if (i == 0) {
          ctx.fillStyle = this.head;
        } else {
          ctx.fillStyle = this.body;
        }

        ctx.fillRect(this.node[i][0], this.node[i][1], UNIT, UNIT);
      }

      // saving gauge to move
      this.m++;
  
      // when it changes direction, it move right now
      if (this._dir != this.dir) {
        this.m += this.movingPoint;
      }

      if (this.m > this.movingPoint) {
        // if it ate apple
        this.handleEat();
        
        // one step forward
        for (var i = this.nodeCount - 1; i > 0; i--) {
          this.node[i][0] = this.node[i - 1][0];
          this.node[i][1] = this.node[i - 1][1];
        }
        if (this.dir == Direction.RIGHT) {
          this.node[0][0] += UNIT;
        } else if (this.dir == Direction.DOWN) {
          this.node[0][1] += UNIT;
        } else if (this.dir == Direction.LEFT) {
          this.node[0][0] -= UNIT;
        } else if (this.dir == Direction.UP) {
          this.node[0][1] -= UNIT;
        }

        this.wallCrash();
        this.selfCrash();

        // initialize gauge 
        this.m = 0;
      }

      // save previous direction
      this._dir = this.dir;
    }
  }
  
  class Apple {
    constructor() {
      this.x = 100;
      this.y = 100;
      this.radius = 10;
      this.count = 0;
      this.color = "#0b0";
    }

    getCrds() {
      return UNIT * (Math.floor(Math.random() * 25));
    }

    // snake ate an apple
    getEaten() {
      this.x = this.getCrds();
      this.y = this.getCrds();
      
      this.count++;
    }

    render() {
      ctx.beginPath();
      ctx.arc(this.x + this.radius, this.y + this.radius, 10, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  class Game {
    constructor(snake, apple) {
      this.over = false;
      this.snake = snake;
      this.apple = apple;
    };
  
    render() {
      if (this.snake.crash) {
        ctx.font = "16px Monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.fillText(
          "YOU GOT " + this.apple.count + " APPLES!",
          (canvas.width / 2),
          ((canvas.height + 20) / 2)
        );

        this.over = true;
      }
    }
  }

  // variables
  var apple = new Apple(); // lower module
  var snake = new Snake(apple); // upper module
  var game = new Game(snake, apple);

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  function main() {
    clearCanvas();
    snake.render();
    apple.render();
    game.render();

    if (!game.over)
      requestAnimationFrame(main);
  }
  
  // run
  main();

  // controller
  function keyDownHandler(e) {
    if (e.key == "ArrowDown") {
      if (snake.dir != Direction.UP) {
        snake.dir = Direction.DOWN;
      }
    } else if (e.key == "ArrowLeft") {
      if (snake.dir != Direction.RIGHT) {
        snake.dir = Direction.LEFT;
      }
    } else if (e.key == "ArrowRight") {
      if (snake.dir != Direction.LEFT) {
        snake.dir = Direction.RIGHT;
      }
    } else if (e.key == "ArrowUp") {
      if (snake.dir != Direction.DOWN) {
        snake.dir = Direction.UP;
      }
    }
  }

  addEventListener("keydown", keyDownHandler);
})()

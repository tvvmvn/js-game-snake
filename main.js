/*
  OOP Modeling

  Game
  Snake
  Apple 
  Stage
*/

(function () {
  // canvas
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.backgroundColor = "#222";

  // constants
  const Direction = {
    UP: 0,
    LEFT: 1,
    RIGHT: 2,
    DOWN: 3
  }  
  
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

  // class
  class Snake {
    constructor(stage, apple) {
      this.x = stage.left + (stage.cell * 4);
      this.y = stage.top;
      this.m = 0;
      this.size = stage.cell;
      this.movingPoint = 20;
      this.moved = true;
      this.node = [
        [stage.left + (stage.cell * 4), stage.top],
        [stage.left + (stage.cell * 3), stage.top],
        [stage.left + (stage.cell * 2), stage.top],
        [stage.left + (stage.cell * 1), stage.top],
        [stage.left, stage.top]
      ],
      this._dir = Direction.RIGHT;
      this.dir = Direction.RIGHT;
      this.color = "#0bf";
      this.stage = stage;
      this.crash = false;
      this.ate = false;
      this.apple = apple;
    }

    selfCrash() {
      for (var h = 3; h < this.node.length; h++) {
        if (this.x == this.node[h][0] && this.y == this.node[h][1]) {
          this.crash = true;
        }
      }
    }

    wallCrash() {
      var leftCrash = this.x < this.stage.left
      var rightCrash = this.x + this.stage.cell > this.stage.right;
      var topCrash = this.y < this.stage.top;
      var bottomCrash = this.y + this.stage.cell > this.stage.bottom;
  
      if (leftCrash || rightCrash || topCrash || bottomCrash) {
        this.crash = true;
      }
    }

    handleEat() {
      if (this.x == this.apple.x && this.y == this.apple.y) {
        // node +1
        this.node.push([this.x, this.y]);
        // get faster
        this.movingPoint -= 1;

        this.apple.getEaten();
      }
    }

    render() {
      // saving gauge to move
      this.m++;
  
      // when it changes direction
      if (this._dir != this.dir) {
        this.m += this.movingPoint;
      }
  
      // update x or y 
      if (this.m > this.movingPoint) {
        if (this.dir == Direction.RIGHT) {
          this.x += this.stage.cell
        } else if (this.dir == Direction.DOWN) {
          this.y += this.stage.cell
        } else if (this.dir == Direction.LEFT) {
          this.x -= this.stage.cell
        } else if (this.dir == Direction.UP) {
          this.y -= this.stage.cell
        }
        
        // initialize gauge 
        this.m = 0;

        // crash check
        this.selfCrash();
        this.wallCrash();

        // no crash, update snake image 
        if (!this.crash) {
          for (var j = this.node.length - 1; j > 0; j--) {
            this.node[j][0] = this.node[j - 1][0];
            this.node[j][1] = this.node[j - 1][1];
          }
          // head
          this.node[0][0] = this.x;
          this.node[0][1] = this.y;
        }
      }

      this.handleEat();
  
      // draw
      for (var i = 0; i < this.node.length; i++) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.node[i][0], this.node[i][1], this.size, this.size);
      }

      // save previous direction
      this._dir = this.dir;
    }
  }
  
  class Apple {
    constructor(stage) {
      this.x = stage.left + 100;
      this.y = stage.top + 100;
      this.radius = 10;
      this.count = 0;
      this.color = "#0b0";
      this.stage = stage;
    }

    // snake ate an apple
    getEaten() {
      this.x = this.stage.left + (this.stage.cell * (Math.floor(Math.random() * 20)));
      this.y = this.stage.top + (this.stage.cell * (Math.floor(Math.random() * 15)));
      
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
    constructor(stage, snake, apple) {
      this.over = false;
      this.stage = stage;
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
          this.stage.left + (this.stage.width / 2),
          this.stage.top + ((this.stage.height + 20) / 2)
        );

        this.over = true;
      }
    }
  }
  
  class Stage {
    constructor() {
      this.width = 460
      this.height = 340
      this.top = 20
      this.left = 20
      this.right = this.left + this.width;
      this.bottom = this.top + this.height;
      this.cell = 20
  
      this.checker = [];
  
      for (var r = 0; r < this.height / this.cell; r++) {
        this.checker[r] = [];
    
        for (var c = 0; c < this.width / this.cell; c++) {
          if ((r + c) % 2) {
            this.checker[r][c] = 1;
          } else {
            this.checker[r][c] = 0;
          }
        }
      }
    }
  
    render() {
      // checker
      ctx.fillStyle = "#333";
  
      for (var r = 0; r < this.checker.length; r++) {
        for (var c = 0; c < this.checker[r].length; c++) {
          if (this.checker[r][c]) {
            ctx.fillRect(
              this.left + (this.cell * c),
              this.top + (this.cell * r),
              this.cell, this.cell);
          }
        }
      }
  
      // border
      ctx.beginPath();
      ctx.strokeStyle = "#ddd";
      ctx.rect(this.left, this.top, this.width, this.height);
      ctx.stroke();
    }
  }
  
  // variables
  var stage = new Stage();
  var apple = new Apple(stage); // lower module
  var snake = new Snake(stage, apple); // upper module
  var game = new Game(stage, snake, apple);

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  function main() {
    clearCanvas();
    stage.render();
    snake.render();
    apple.render();
    game.render();

    if (!game.over)
      requestAnimationFrame(main);
  }
  
  // run
  main();
})()

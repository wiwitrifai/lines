"use strict";

class GameController {
  constructor(height, width) {
    this.init(height, width);
  }

  init(height, width) {
    this.height = height;
    this.width = width;
    this.generator = new Generator(this.height, this.width);
    this.solver = new Solver(this.height, this.width);
    this.display = new DisplayProcessor();
    this.display.addStartEvent(this.start.bind(this));
    this.display.addGiveUpEvent(this.giveUp.bind(this));
    this.display.addSkipEvent(this.skipAnimation.bind(this));
    this.display.addCheckSolutionEvent(this.checkSolution.bind(this));
    this.count = 0;
    this.animating = false;
  }

  start() {
    this.animating = false;
    this.board = this.generator.randomBoard();
    this.initBoard = JSON.parse(JSON.stringify(this.board));
    this.count = 0;
    this.initRequiredSteps = this.solver.solve(this.board);
    this.display.render(
      this.board,
      {
        moves: this.count,
        remaining: this.initRequiredSteps,
        wasted: 0
      },
      this.rotate.bind(this)
    );

    this.display.updateMessage(null);
    this.display.displayGiveUpButton(true);
    this.display.displaySkipButton(false);
    this.display.displayCheckSolutionButton(false);
  }

  giveUp() {
    this.display.displayGiveUpButton(false);
    this.display.displaySkipButton(true);
    this.display.updateMessage("You lose!");
    this.animateSolution();
  }

  checkSolution() {
    this.animating = false;
    this.board = this.solver.getBoard();
    this.count += this.solver.steps;
    let message = "<small>This is the only solution!</small>";
    let currentRequiredSteps = this.calculate(this.initBoard, this.board);
    if (currentRequiredSteps != this.initRequiredSteps) {
      message = "<small>There is a better solution!</small>";
      this.solver.solve(this.initBoard);
    } else {
      let anotherSolution = this.solver.findAnotherSolution(this.initBoard, this.board);
      if (anotherSolution == -1)
        this.solver.solve(this.initBoard);
      else
        message = "<small>There is another solution!</small>";
    }
    this.solver.steps = 0;
    this.showSolution();
    this.display.displayCheckSolutionButton(false);
    this.display.updateMessage(message);
  }

  win() {
    this.showSolution();
    this.display.displayGiveUpButton(false);
    this.display.displayCheckSolutionButton(true);
    this.display.updateMessage("You Win!");
  }

  showSolution() {
    let solution = this.solver.getBoard();
    this.display.render(
      solution,
      {
        moves: this.count + this.solver.steps,
        remaining: 0,
        wasted: this.solver.steps + this.count - this.initRequiredSteps
      },
      function() {}
    );
  }

  skipAnimation() {
    this.animating = false;
    this.showSolution();
    this.display.displaySkipButton(false);
    this.display.displayCheckSolutionButton(true);
  }

  async animateSolution() {
    this.display.render(
      this.board,
      {
        moves: this.count,
        remaining: this.solver.steps,
        wasted: this.solver.steps + this.count - this.initRequiredSteps
      },
      function() {}
    );
    let solution = this.solver.getBoard();
    const delay = 400;
    const sleep = (delay) => new Promise((f) => setTimeout(f, delay));
    this.animating = true;

    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        if (!this.animating)
          return;
        let str = this.board[i][j];
        if (solution[i][j] == str) continue;
        let clockwise = str[3] + str.substr(0, 3);
        let counterclockwise = str.substr(1, 3) + str[0];
        if (solution[i][j] == clockwise) {
          this.rotate(i, j, true);
          await sleep(delay);
        } else if (solution[i][j] == counterclockwise) {
          this.rotate(i, j, false);
          await sleep(delay);
        } else {
          this.rotate(i, j, false);
          await sleep(delay);
          if (!this.animating)
            return;
          this.rotate(i, j, false);
          await sleep(delay);
        }
      }
    }
    this.animating = false;
    this.display.displaySkipButton(false);
    this.display.displayCheckSolutionButton(true);
  }

  rotate(row, col, isClockwise) {
    let str = this.board[row][col];
    if (str == "0000" || str == "1111") {
      return;
    }
    if (isClockwise) {
      this.board[row][col] = str[3] + str.substr(0, 3);
    } else {
      this.board[row][col] = str.substr(1, 3) + str[0];
    }
    ++this.count
    let remaining = this.solver.solve(this.board);
    if (remaining == 0 && !this.animating) {
      this.win();
      return;
    }
    this.display.updateCell(row, col, this.board[row][col]);
    this.display.updateMoves(this.count);
    this.display.updateRemaining(remaining);
    this.display.updateWasted(remaining + this.count - this.initRequiredSteps);
  }

  calculate(initBoard, board) {
    let result = 0;
    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        let str = initBoard[i][j];
        if (board[i][j] == str) continue;
        let clockwise = str[3] + str.substr(0, 3);
        let counterclockwise = str.substr(1, 3) + str[0];
        if (board[i][j] == clockwise || board[i][j] == counterclockwise) {
          result += 1;
        } else {
          result += 2;
        }
      }
    }
    return result;
  }
}

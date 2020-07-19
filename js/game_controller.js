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
    this.display.addCheckSolutionEvent(this.checkSolution.bind(this));
    this.count = 0;
  }

  start() {
    this.board = this.generator.randomBoard();
    this.initialBoard = JSON.parse(JSON.stringify(this.board));
    this.count = 0;
    this.initialRequiredSteps = this.solver.solve(this.board);
    this.display.render(
      this.board,
      {
        moves: this.count,
        remaining: this.initialRequiredSteps,
        wasted: 0
      },
      this.rotate.bind(this)
    );

    this.display.updateMessage(null);
    this.display.showGiveUpButton();
    this.display.hideCheckSolutionButton();
  }

  giveUp() {
    this.count += this.solver.steps;
    this.solver.steps = 0;
    this.solve();
    this.display.hideGiveUpButton();
    this.display.showCheckSolutionButton();
    this.display.updateMessage("You lose!");
  }

  checkSolution() {
    this.solver.solve(this.initialBoard);
    this.solver.steps = 0;
    this.solve();
    this.display.hideCheckSolutionButton();
    this.display.updateMessage("<small>This is the best solution!</small>");
  }

  win() {
    this.solve();
    this.display.hideGiveUpButton();
    this.display.showCheckSolutionButton();
    this.display.updateMessage("You Win!");
  }

  solve() {
    let solution = this.solver.getBoard();
    this.display.render(
      solution,
      {
        moves: this.count + this.solver.steps,
        remaining: 0,
        wasted: this.solver.steps + this.count - this.initialRequiredSteps
      },
      function() {}
    );
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
    if (remaining == 0) {
      this.win();
      return;
    }
    this.display.updateCell(row, col, this.board[row][col]);
    this.display.updateMoves(this.count);
    this.display.updateRemaining(remaining);
    this.display.updateWasted(remaining + this.count - this.initialRequiredSteps);
  }
}

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
    this.count = 0;
  }

  start() {
    this.display.addGiveUpEvent(this.giveUp.bind(this));
    this.board = this.generator.randomBoard();
    this.count = 0;
    this.initial = this.solver.solve(this.board);
    this.display.render(
      this.board,
      {
        moves: this.count,
        remaining: this.initial,
        wasting: 0
      },
      this.rotate.bind(this)
    );
    this.display.updateMessage(null);
  }

  giveUp() {
    console.log("Give up");
    this.display.updateMessage("You lose!");
    this.solve();
    this.display.removeGiveUpEvent();
  }

  solve() {
    let solution = this.solver.getBoard();
    this.display.render(
      solution,
      {
        moves: this.count + this.solver.steps,
        remaining: 0,
        wasting: this.solver.steps + this.count - this.initial
      },
      function() {}
    );
  }

  rotate(row, col, isClockwise) {
    let str = this.board[row][col];
    if (isClockwise) {
      this.board[row][col] = str[3] + str.substr(0, 3);
    } else {
      this.board[row][col] = str.substr(1, 3) + str[0];
    }
    ++this.count
    let remaining = this.solver.solve(this.board);
    if (remaining == 0) {
      this.display.updateMessage("You Win!");
      this.solve();
      this.display.removeGiveUpEvent();
      return;
    }
    this.display.updateCell(row, col, this.board[row][col]);
    this.display.updateMoves(this.count);
    this.display.updateRemaining(remaining);
    this.display.updateWasting(remaining + this.count - this.initial);
  }
}

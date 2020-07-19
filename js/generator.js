"use strict";

class Generator {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  randomBoard() {
    let board = new Array(this.height);
    for (let i = 0; i < this.height; ++i)
      board[i] = new Array(this.width).fill(0);

    let count = Math.floor((0.9 + Math.random()) * this.height * this.width);

    for (let cnt = 0; cnt < count; ++cnt) {
      if (Math.random() < 0.5) {
        let row = Math.floor(Math.random() * (this.height - 1));
        let col = Math.floor(Math.random() * this.width);
        board[row][col] |= 4;
        board[row+1][col] |= 1;
      } else {
        let row = Math.floor(Math.random() * this.height);
        let col = Math.floor(Math.random() * (this.width - 1));
        board[row][col] |= 2;
        board[row][col+1] |= 8;
      }
    }
    let queue = [];
    let pushQueue = function (board, i, j, queue) {
      if (board[i][j] == 5 || board[i][j] == 10) {
        queue.push([i, j]);
      }
    };
    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        pushQueue(board, i, j, queue);
      }
    }
    for (let i = 0; i < queue.length; ++i) {
      let row = queue[i][0], col = queue[i][1];
      if (board[row][col] == 5) {
        let rnd = Math.random();
        if (rnd >= 0.3) {
          board[row+1][col] ^= 1;
          board[row][col] ^= 4;
          pushQueue(board, row+1, col, queue);
        }
        if (rnd < 0.7) {
          board[row-1][col] ^= 4;
          board[row][col] ^= 1;
          pushQueue(board, row-1, col, queue);
        }
      } else if (board[row][col] == 10) {
        let rnd = Math.random();
        if (rnd >= 0.3) {
          board[row][col+1] ^= 8;
          board[row][col] ^= 2;
          pushQueue(board, row, col+1, queue);
        }
        if (rnd < 0.7) {
          board[row][col-1] ^= 2;
          board[row][col] ^= 8;
          pushQueue(board, row, col-1, queue);
        }
      }
    }

    let rotateByte = function (byte, rot) {
      let mask = (1 << rot) - 1;
      return (byte >> rot) | ((mask & byte) << (4-rot));
    };

    let byteToStr = function (byte) {
      let str = "";
      for (let i = 0; i < 4; ++i) {
        if ((byte >> i) & 1)
          str += '1';
        else
          str += '0';
      }
      return str;
    };
    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        let byte = rotateByte(board[i][j], Math.floor(Math.random() * 4));
        board[i][j] = byteToStr(byte);
      }
    }
    return board;
  }
}

"use strict";

class Solver {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.mcmf = new MinCostMaxFlow(height * width * 2 + 2);
    this.verticalNodes = new Array(this.height * this.width);
    this.horizontalNodes = new Array(this.height * this.width);
    this.steps = -2;
  }

  solve(board) {
    this.mcmf.clear();
    let costs = new Array(this.height * this.width);
    let source = 0, sink = 1, node = 2;
    let indegree = 0, outdegree = 0;
    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        let id = i * this.width + j;
        costs[id] = new Array(4);
        let count = 0;
        let str = board[i][j];
        let cost = costs[id];
        for (let k = 0; k < 4; ++k) {
          count += str.charAt(k) == '1';
        }
        this.horizontalNodes[id] = this.verticalNodes[id] = node++;
        if (count == 2) {
          this.horizontalNodes[id] = node++;
          for (let k = 0; k < 4; ++k) {
            cost[k] = 3 * (str.charAt(k) == '0');
          }
          if ((i + j) & 1) {
            this.mcmf.addEdge(source, this.horizontalNodes[id], 1, 0);
            this.mcmf.addEdge(source, this.verticalNodes[id], 1, 0);
            indegree += 2;
          } else {
            this.mcmf.addEdge(this.horizontalNodes[id], sink, 1, 0);
            this.mcmf.addEdge(this.verticalNodes[id], sink, 1, 0);
            outdegree += 2;
          }
        } else {
          if (count == 1) {
            let pos = -1;
            for (let k = 0; k < 4; ++k) {
              if (str.charAt(k) == '1')
                pos = k;
              else
                cost[k] = 3;
            }
            cost[pos] = 0;
            cost[pos^2] = 6;
          } else if (count == 3) {
            let pos = -1;
            for (let k = 0; k < 4; ++k) {
              if (str.charAt(k) == '0')
                pos = k;
              else
                cost[k] = 1;
            }
            cost[pos] = 4;
            cost[pos^2] = -2;
          } else {
            cost.fill(0);
          }
          if ((i + j) & 1) {
            this.mcmf.addEdge(source, this.verticalNodes[id], count, 0);
            indegree += count;
          } else {
            this.mcmf.addEdge(this.verticalNodes[id], sink, count, 0);
            outdegree += count;
          }
        }
      }
    }
    if (indegree != outdegree) {
      return this.steps = -1;
    }
    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        if (i + 1 < this.height) {
          let u = i * this.width + j, v = u + this.width;
          let sumcost = costs[u][2] + costs[v][0];
          if (((i + j) & 1) == 0) {
            let tmp = u;
            u = v;
            v = tmp;
          }
          this.mcmf.addEdge(this.verticalNodes[u], this.verticalNodes[v], 1, sumcost);
        }
        if (j + 1 < this.width) {
          let u = i * this.width + j, v = u + 1;
          let sumcost = costs[u][1] + costs[v][3];
          if (((i + j) & 1) == 0) {
            let tmp = u;
            u = v;
            v = tmp;
          }
          this.mcmf.addEdge(this.horizontalNodes[u], this.horizontalNodes[v], 1, sumcost);
        }
      }
    }
    let result = this.mcmf.run(source, sink);
    if (result.flow != indegree)
      return this.steps = -1;
    else
      return this.steps = Math.floor(result.cost/3);
  }

  getBoard() {
    if (this.steps < 0)
      return new Array(this.height).fill(new Array(this.width).fill('0000'));
    let whose = new Array(this.mcmf.nodes).fill([-1 ,-1]);
    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        let id = i * this.width + j;
        whose[this.verticalNodes[id]] = [i, j];
        if (this.horizontalNodes[id] != this.verticalNodes[id])
          whose[this.horizontalNodes[id]] = [i, j];
      }
    }

    let board = new Array(this.height);
    for (let i = 0; i < this.height; ++i)
      board[i] = new Array(this.width).fill(0);

    for (let i = 2; i < this.mcmf.nodes; ++i) {
      let cur = whose[i];
      if (cur[0] < 0 || ((cur[0] + cur[1]) & 1) == 0) continue;
      for (let e of this.mcmf.graph[i]) {
        if (e.to < 2 || e.flow <= 0) continue;
        let oth = whose[e.to];
        if (cur[0] == oth[0]) {
          board[cur[0]][Math.min(cur[1], oth[1])] |= 2;
          board[cur[0]][Math.max(cur[1], oth[1])] |= 8;
        } else if (cur[1] == oth[1]) {
          board[Math.min(cur[0], oth[0])][cur[1]] |= 4;
          board[Math.max(cur[0], oth[0])][cur[1]] |= 1;
        }
      }
    }
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
        board[i][j] = byteToStr(board[i][j]);
      }
    }
    return board;
  }
}

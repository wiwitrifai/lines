"use strict"

const PriorityQueue = require('./priority_queue.js');

class Edge {
  constructor(to, cap, flow, cost, rev) {
    this.to = to;
    this.cap = cap;
    this.flow = flow;
    this.cost = cost;
    this.rev = rev;
  }
}

class MinCostMaxFlow {
  constructor(maxNodes) {
    this.nodes = maxNodes;
    this.priority = new Array(this.nodes).fill(0);
    this.potential = new Array(this.nodes).fill(0);
    this.curflow = new Array(this.nodes).fill(0);
    this.prevedge = new Array(this.nodes).fill(0);
    this.prevnode = new Array(this.nodes).fill(0);
    this.graph = Array(this.nodes);
    for (let i = 0; i < this.nodes; ++i)
      this.graph[i] = [];
  }

  addEdge(from, to, cap, cost) {
    let a = new Edge(to, cap, 0, cost, this.graph[to].length);
    let b = new Edge(from, 0, 0, -cost, this.graph[from].length);
    this.graph[from].push(a);
    this.graph[to].push(b);
  }

  bellmanford(source, dist) {
    dist.fill(1000000000);
    dist[source] = 0;
    let qtail = 0;
    let queue = new Array(this.nodes);
    let inqueue = new Array(this.nodes).fill(false);
    queue[qtail++] = source;
    for (let qhead = 0; qhead != qtail; ++qhead) {
      let u = queue[qhead % this.nodes];
      for (let e of this.graph[u]) {
        if (e.cap <= e.flow) continue;
        let v = e.to;
        let newdist = dist[u] + e.cost;
        if (dist[v] > newdist) {
          dist[v] = newdist;
          if (!inqueue[v]) {
            inqueue[v] = true;
            queue[qtail++ % this.nodes] = v;
          }
        }
      }
    }
  }

  run(source, sink) {
    this.bellmanford(source, this.potential);
    let flow = 0;
    let cost = 0;
    while (true) {
      let pq = new PriorityQueue();
      this.priority.fill(1000000000);
      this.priority[source] = 0;
      pq.push(0, source);
      this.curflow[source] = 1000000000;
      while (pq.length > 0) {
        let top = pq.pop();
        if (this.priority[top.element] != -top.priority) continue;
        let d = -top.priority;
        let u = top.element;
        for (let i = 0; i < this.graph[u].length; ++i) {
          let e = this.graph[u][i];
          if (e.cap <= e.flow) continue;
          let v = e.to;
          let newpriority = this.priority[u] + e.cost + this.potential[u] - this.potential[v];
          if (this.priority[v] > newpriority) {
            this.priority[v] = newpriority;
            pq.push(-newpriority, v);
            this.prevnode[v] = u;
            this.prevedge[v] = i;
            this.curflow[v] = Math.min(this.curflow[u], e.cap - e.flow);
          }
        }
      }
      if (this.priority[sink] == 1000000000) break;
      let df = this.curflow[sink];
      flow += df;
      for (let v = sink; v != source; v = this.prevnode[v]) {
        let e = this.graph[this.prevnode[v]][this.prevedge[v]];
        e.flow += df;
        this.graph[v][e.rev] -= df;
        cost += e.cost * df;
      }
    }
    return { 'flow': flow, 'cost': cost };
  }
}

module.exports = MinCostMaxFlow;

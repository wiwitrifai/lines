"use strict"

class PqElement {
  constructor(priority, element) {
    this.priority = priority;
    this.element = element;
  }
}

class PriorityQueue {
  constructor() {
    this.length = 0;
    this.items = [];
  }

  push(priority, element) {
    let elem = new PqElement(priority, element);
    if (this.items.length < this.length)
      this.items.push(elem);
    else
      this.items[this.length] = elem;
    let i = this.length;
    while (i > 0) {
      let p = Math.floor((i - 1) / 2);
      if (this.items[i].priority > this.items[p].priority) {
        let tmp = this.items[i];
        this.items[i] = this.items[p];
        this.items[p] = tmp;
      } else {
        break;
      }
      i = p;
    }
    ++this.length;
  }

  pop() {
    let top = this.items[0];
    this.items[0] = this.items[this.length-1];
    --this.length;
    let i = 0;
    while (2 * i + 1 < this.length) {
      let c = 2 * i + 1;
      if (c + 1 < this.length && this.items[c+1].priority > this.items[c].priority) {
        c = c + 1;
      }
      if (this.items[c].priority > this.items[i].priority) {
        let tmp = this.items[i];
        this.items[i] = this.items[c];
        this.items[c] = tmp;
      } else {
        break;
      }
      i = c;
    }
    return top;
  }
}

module.exports = PriorityQueue;

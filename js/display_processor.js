"uses strict";

class DisplayProcessor {
 constructor() {
    this.gridElement = document.querySelector('.grid-container');

    this.movesElement = document.querySelector('#moves-value');
    this.remainingElement = document.querySelector('#remaining-value');
    this.wastingElement = document.querySelector('#wasting-value');

    this.startElement = document.querySelector('#start-button');
    this.giveUpElement = document.querySelector('#give-up-button');
    this.checkAnswerElement = document.querySelector('#check-answer-button');
  }

  clearElementChilds(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  render(board, metadata, callback) {
    let height = board.length;
    let width = board[0].length;
    this.clearElementChilds(this.gridElement);
    for (let i = 0; i < height; ++i) {
      let rowElement = document.createElement('tr');
      rowElement.setAttribute("class", "grid-row");
      for (let j = 0; j < width; ++j) {
        let cellElement = document.createElement('td');
        cellElement.setAttribute("class", "grid-cell");
        let imgElement = document.createElement('img');
        imgElement.setAttribute("class", "cell-"+i+"-"+j);
        imgElement.setAttribute("src", "img/cell-" + board[i][j] + ".png");
        imgElement.addEventListener('click', function (e) {
          callback(i, j, false);
        });
        imgElement.addEventListener('contextmenu', function (e) {
          callback(i, j, true);
          e.preventDefault();
        });
        cellElement.appendChild(imgElement);
        rowElement.appendChild(cellElement);
      }
      this.gridElement.appendChild(rowElement);
    }

    this.updateMoves(metadata.moves);
    this.updateRemaining(metadata.remaining);
    this.updateWasting(metadata.wasting);
  }

  addStartEvent(callback) {
    this.startElement.addEventListener('click', callback);
  }

  addGiveUpEvent(callback) {
    this.giveUpElement.addEventListener('click', callback);
  }

  addCheckAnswerEvent(callback) {
    this.checkAnswerElement.addEventListener('click', callback);
  }

  showGiveUpButton() {
    this.giveUpElement.style.display = "block";
  }

  hideGiveUpButton() {
    this.giveUpElement.style.display = "none";
  }

  showCheckAnswerButton() {
    this.checkAnswerElement.style.display = "block";
  }

  hideCheckAnswerButton() {
    this.checkAnswerElement.style.display = "none";
  }

  updateCell(row, col, value) {
    let element = document.querySelector('.cell-' + row + '-' + col);
    element.setAttribute("src", "img/cell-" + value + ".png");
  }

  updateMoves(moves) {
    this.movesElement.innerHTML = moves;
  }

  updateRemaining(remaining) {
    this.remainingElement.innerHTML = remaining;
  }

  updateWasting(wasting) {
    this.wastingElement.innerHTML = wasting;
  }

  updateMessage(message) {
    let element = document.querySelector('.message');
    if (message) {
      element.style.visibility = 'visible';
      element.innerHTML = message;
    } else {
      element.style.visibility = 'hidden';
      element.innerHTML = "";
    }
  }
}

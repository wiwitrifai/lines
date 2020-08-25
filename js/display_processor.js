"uses strict";

class DisplayProcessor {
 constructor() {
    this.gridElement = document.querySelector('.grid-container');

    this.movesElement = document.querySelector('#moves-value');
    this.remainingElement = document.querySelector('#remaining-value');
    this.wastedElement = document.querySelector('#wasted-value');

    this.startElement = document.querySelector('#start-button');
    this.giveUpElement = document.querySelector('#give-up-button');
    this.skipElement = document.querySelector('#skip-button');
    this.CheckSolutionElement = document.querySelector('#check-solution-button');
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
    this.updateWasted(metadata.wasted);
  }

  addStartEvent(callback) {
    this.startElement.addEventListener('click', callback);
  }

  addGiveUpEvent(callback) {
    this.giveUpElement.addEventListener('click', callback);
  }

  addSkipEvent(callback) {
    this.skipElement.addEventListener('click', callback);
  }

  addCheckSolutionEvent(callback) {
    this.CheckSolutionElement.addEventListener('click', callback);
  }

  displayGiveUpButton(show) {
    if (show)
      this.giveUpElement.style.display = "block";
    else
      this.giveUpElement.style.display = "none";
  }

  displaySkipButton(show) {
    if (show)
      this.skipElement.style.display = "block";
    else
      this.skipElement.style.display = "none";
  }

  displayCheckSolutionButton(show) {
    if (show)
      this.CheckSolutionElement.style.display = "block";
    else
      this.CheckSolutionElement.style.display = "none";
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

  updateWasted(wasted) {
    this.wastedElement.innerHTML = wasted;
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

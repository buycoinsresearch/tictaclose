"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var origBoard;
var huPlayer = 'O';
var aiPlayer = 'X';
var winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]];
var cells = document.querySelectorAll('.cell'); // startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());

  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  var gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  var plays = board.reduce(function (a, e, i) {
    return e === player ? a.concat(i) : a;
  }, []);
  var gameWon = null;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = winCombos.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          index = _step$value[0],
          win = _step$value[1];

      if (win.every(function (elem) {
        return plays.indexOf(elem) > -1;
      })) {
        gameWon = {
          index: index,
          player: player
        };
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return gameWon;
}

function gameOver(gameWon) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = winCombos[gameWon.index][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var index = _step2.value;
      document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "lawngreen" : "orchid";
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }

  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
  document.querySelector(".endgame .text").style.fontFamily = "courier, monospace";
  document.querySelector(".endgame .text").style.fontSize = "xx-large";
}

function emptySquares() {
  return origBoard.filter(function (s) {
    return typeof s == 'number';
  });
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "Aquamarine";
      cells[i].removeEventListener('click', turnClick, false);
    }

    declareWinner("Tie Game!");
    return true;
  }

  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares();

  if (checkWin(newBoard, huPlayer)) {
    return {
      score: -10
    };
  } else if (checkWin(newBoard, aiPlayer)) {
    return {
      score: 10
    };
  } else if (availSpots.length === 0) {
    return {
      score: 0
    };
  }

  var moves = [];

  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

  var bestMove;

  if (player === aiPlayer) {
    var bestScore = -10000;

    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;

    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

var _require = require('web3'),
    Web3 = _require.Web3; // let accounts = [];


function makePayment() {
  var _ref;

  return regeneratorRuntime.async(function makePayment$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(ethereum.request({
            method: 'eth_sendTransaction',
            params: [(_ref = {
              from: accounts[0],
              to: '0x70480bDAC3EbDbB37FF875d4aeb95d1d381bB873',
              value: '0x29a2241af62c0000'
            }, _defineProperty(_ref, "value", '0x29a2241af62c0000'), _defineProperty(_ref, "gasPrice", '0x09184e72a000'), _defineProperty(_ref, "gas", '0x2710'), _ref)]
          }).then(function (txHash) {
            return console.log(txHash);
          })["catch"](function (error) {
            return console.error;
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}

function getAccount() {
  var accounts, account;
  return regeneratorRuntime.async(function getAccount$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!window.ethereum) {
            _context2.next = 6;
            break;
          }

          console.log("we outchea");
          _context2.next = 4;
          return regeneratorRuntime.awrap(window.ethereum.send('eth_requestAccounts'));

        case 4:
          window.web3 = new Web3(window.ethereum);
          return _context2.abrupt("return", true);

        case 6:
          if (!ethereum || !ethereum.isMetaMask) {
            alert('Please install MetaMask.');
          }

          _context2.next = 9;
          return regeneratorRuntime.awrap(ethereum.request({
            method: 'eth_requestAccounts'
          }));

        case 9:
          accounts = _context2.sent;
          account = accounts[0];
          console.log(account);
          makePayment();
          document.getElementById("showAccount").innerHTML = account;

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
} // ethereum.on('accountsChanged', function (accounts) {
// 	// Time to reload your interface with accounts[0]!
//   });
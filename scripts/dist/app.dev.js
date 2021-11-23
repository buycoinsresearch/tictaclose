"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Web3 = require('web3');

var ethers = require('ethers');

var origBoard;
var huPlayer = 'O';
var aiPlayer = 'X';
var winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]]; // startGame();

window.Game = function () {
  var cells = document.querySelectorAll('.cell');
  startGame();

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

    if (gameWon.player == huPlayer) {
      reward();
    }
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

  function reward() {
    var nodeProvider, contractAddress, contractAbi, gameContract, wallet, gameConnected;
    return regeneratorRuntime.async(function reward$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/<projectId>"));

          case 2:
            nodeProvider = _context.sent;
            contractAddress = "0x70480bDAC3EbDbB37FF875d4aeb95d1d381bB873";
            contractAbi = [{
              "anonymous": false,
              "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
              }, {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
              }],
              "name": "OwnershipTransferred",
              "type": "event"
            }, {
              "anonymous": false,
              "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "_from",
                "type": "address"
              }, {
                "indexed": false,
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
              }],
              "name": "Purchase",
              "type": "event"
            }, {
              "anonymous": false,
              "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "_tokenAddress",
                "type": "address"
              }, {
                "indexed": false,
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
              }, {
                "indexed": true,
                "internalType": "address",
                "name": "_winner",
                "type": "address"
              }],
              "name": "rewardERC20Token",
              "type": "event"
            }, {
              "anonymous": false,
              "inputs": [{
                "indexed": false,
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              }, {
                "indexed": true,
                "internalType": "address",
                "name": "_winner",
                "type": "address"
              }],
              "name": "rewards",
              "type": "event"
            }, {
              "anonymous": false,
              "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "_tokenAddress",
                "type": "address"
              }, {
                "indexed": false,
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
              }, {
                "indexed": true,
                "internalType": "address",
                "name": "_destination",
                "type": "address"
              }],
              "name": "withdrawERC20Token",
              "type": "event"
            }, {
              "anonymous": false,
              "inputs": [{
                "indexed": false,
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
              }, {
                "indexed": true,
                "internalType": "address",
                "name": "_destination",
                "type": "address"
              }],
              "name": "withdrawEth",
              "type": "event"
            }, {
              "inputs": [],
              "name": "owner",
              "outputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
              }],
              "stateMutability": "view",
              "type": "function"
            }, {
              "inputs": [],
              "name": "renounceOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }, {
              "inputs": [{
                "internalType": "address payable",
                "name": "_winner",
                "type": "address"
              }, {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              }],
              "name": "reward",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }, {
              "inputs": [{
                "internalType": "address",
                "name": "_tokenContract",
                "type": "address"
              }, {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              }, {
                "internalType": "address payable",
                "name": "_winner",
                "type": "address"
              }],
              "name": "tokenReward",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }, {
              "inputs": [{
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
              }],
              "name": "transferOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }, {
              "inputs": [{
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }, {
                "internalType": "address payable",
                "name": "destAddr",
                "type": "address"
              }],
              "name": "withdraw",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }, {
              "inputs": [{
                "internalType": "address",
                "name": "_tokenContract",
                "type": "address"
              }, {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              }, {
                "internalType": "address payable",
                "name": "destAddr",
                "type": "address"
              }],
              "name": "withdrawToken",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }, {
              "stateMutability": "payable",
              "type": "receive"
            }];
            _context.next = 7;
            return regeneratorRuntime.awrap(new ethers.Contract(contractAddress, contractAbi, nodeProvider));

          case 7:
            gameContract = _context.sent;
            _context.next = 10;
            return regeneratorRuntime.awrap(new ethers.Wallet("0x" + "<privateKey>", nodeProvider));

          case 10:
            wallet = _context.sent;
            _context.next = 13;
            return regeneratorRuntime.awrap(gameContract.connect(wallet));

          case 13:
            gameConnected = _context.sent;
            _context.next = 16;
            return regeneratorRuntime.awrap(price(5000000000));

          case 16:
            price = _context.sent;
            _context.next = 19;
            return regeneratorRuntime.awrap(Math.round(price * Math.pow(10, 18)));

          case 19:
            price = _context.sent;
            _context.next = 22;
            return regeneratorRuntime.awrap(price.toString());

          case 22:
            strPrice = _context.sent;
            console.log(strPrice);
            _context.next = 26;
            return regeneratorRuntime.awrap(gameConnected.reward("0x66fe4806cD41BcD308c9d2f6815AEf6b2e38f9a3", strPrice).then(function (result) {
              console.log(result);
            }));

          case 26:
          case "end":
            return _context.stop();
        }
      }
    });
  }
}; // let accounts = [];


window.priceCalculator = function _callee(dollarPrice) {
  var web3, aggregatorV3InterfaceABI, addr, priceFeed, roundData, decimatedDollar, price;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          web3 = new Web3("https://rinkeby.infura.io/v3/e93d42bc84a24d3eac4cd187495f0adf");
          aggregatorV3InterfaceABI = [{
            "inputs": [],
            "name": "decimals",
            "outputs": [{
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }],
            "stateMutability": "view",
            "type": "function"
          }, {
            "inputs": [],
            "name": "description",
            "outputs": [{
              "internalType": "string",
              "name": "",
              "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
          }, {
            "inputs": [{
              "internalType": "uint80",
              "name": "_roundId",
              "type": "uint80"
            }],
            "name": "getRoundData",
            "outputs": [{
              "internalType": "uint80",
              "name": "roundId",
              "type": "uint80"
            }, {
              "internalType": "int256",
              "name": "answer",
              "type": "int256"
            }, {
              "internalType": "uint256",
              "name": "startedAt",
              "type": "uint256"
            }, {
              "internalType": "uint256",
              "name": "updatedAt",
              "type": "uint256"
            }, {
              "internalType": "uint80",
              "name": "answeredInRound",
              "type": "uint80"
            }],
            "stateMutability": "view",
            "type": "function"
          }, {
            "inputs": [],
            "name": "latestRoundData",
            "outputs": [{
              "internalType": "uint80",
              "name": "roundId",
              "type": "uint80"
            }, {
              "internalType": "int256",
              "name": "answer",
              "type": "int256"
            }, {
              "internalType": "uint256",
              "name": "startedAt",
              "type": "uint256"
            }, {
              "internalType": "uint256",
              "name": "updatedAt",
              "type": "uint256"
            }, {
              "internalType": "uint80",
              "name": "answeredInRound",
              "type": "uint80"
            }],
            "stateMutability": "view",
            "type": "function"
          }, {
            "inputs": [],
            "name": "version",
            "outputs": [{
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
          }];
          addr = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";
          _context2.next = 5;
          return regeneratorRuntime.awrap(new web3.eth.Contract(aggregatorV3InterfaceABI, addr));

        case 5:
          priceFeed = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(priceFeed.methods.latestRoundData().call());

        case 8:
          roundData = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(roundData["answer"]);

        case 11:
          roundData = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(dollarPrice);

        case 14:
          _context2.t0 = _context2.sent;
          _context2.t1 = Math.pow(10, 8);
          decimatedDollar = _context2.t0 * _context2.t1;
          _context2.next = 19;
          return regeneratorRuntime.awrap(decimatedDollar);

        case 19:
          _context2.t2 = _context2.sent;
          _context2.t3 = parseInt(roundData);
          price = _context2.t2 / _context2.t3;
          return _context2.abrupt("return", price);

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  });
};

window.makePayment = function _callee2() {
  var price, hexPrice, account, transactionHash;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(priceCalculator(5));

        case 2:
          price = _context3.sent;
          price = price * Math.pow(10, 18);
          price = Math.round(price);
          _context3.next = 7;
          return regeneratorRuntime.awrap(price.toString(16));

        case 7:
          hexPrice = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(getAccount());

        case 10:
          account = _context3.sent;
          _context3.next = 13;
          return regeneratorRuntime.awrap(ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: account,
              to: '0x70480bDAC3EbDbB37FF875d4aeb95d1d381bB873',
              value: hexPrice
            }]
          }));

        case 13:
          transactionHash = _context3.sent;
          document.cookie = "transactionHash=" + transactionHash;
          document.cookie = "price=" + price;
          document.cookie = "account=" + account;
          return _context3.abrupt("return", account);

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  });
};

window.paymentStatus = function _callee3() {
  var x, transactionHash, amount, account, receipt;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          x = document.cookie.split(';');
          transactionHash = x[0].split('=')[1];
          _context4.next = 4;
          return regeneratorRuntime.awrap(transactionHash.toString());

        case 4:
          transactionHash = _context4.sent;
          amount = x[1].split('=')[1]; // amount = amount.toString(16)
          // console.log(amount)

          account = x[2].split('=')[1]; // account = account.toString(16)
          // console.log(account)

          _context4.next = 9;
          return regeneratorRuntime.awrap(ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [transactionHash]
          }));

        case 9:
          receipt = _context4.sent;

          if (!(receipt !== null)) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", true);

        case 14:
          window.alert("Payment unconfirmed. Retry in 15 seconds");
          return _context4.abrupt("return", false);

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  });
};

window.getAccount = function _callee4() {
  var accounts, account;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(ethereum.request({
            method: 'eth_requestAccounts'
          }));

        case 2:
          accounts = _context5.sent;
          _context5.next = 5;
          return regeneratorRuntime.awrap(accounts[0]);

        case 5:
          account = _context5.sent;

          if (!(typeof account !== 'undefined')) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", account);

        case 10:
          return _context5.abrupt("return", "");

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // ethereum.on('accountsChanged', function (accounts) {
// 	// Time to reload your interface with accounts[0]!
//   });
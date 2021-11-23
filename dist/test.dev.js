"use strict";

var ethers = require('ethers');

var Web3 = require('web3');

function reward() {
  var nodeProvider, contractAddress, contractAbi, gameContract, wallet, gameConnected;
  return regeneratorRuntime.async(function reward$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/e93d42bc84a24d3eac4cd187495f0adf"));

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
          return regeneratorRuntime.awrap(new ethers.Wallet("0x" + "address", nodeProvider));

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

price = function (_price) {
  function price(_x) {
    return _price.apply(this, arguments);
  }

  price.toString = function () {
    return _price.toString();
  };

  return price;
}(function _callee(dollarPrice) {
  var web3, aggregatorV3InterfaceABI, addr, priceFeed;
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
          _context2.t1 = parseInt(roundData);
          price = _context2.t0 / _context2.t1;
          return _context2.abrupt("return", price);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  });
});

reward();
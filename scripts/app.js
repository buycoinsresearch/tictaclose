const Web3 = require('web3');
const ethers = require('ethers')

var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]


// startGame();

window.Game = () => {
	const cells = document.querySelectorAll('.cell');
	startGame()
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
			turn(square.target.id, huPlayer)
			if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
		}
	}
	
	function turn(squareId, player) {
		origBoard[squareId] = player;
		document.getElementById(squareId).innerText = player;
		let gameWon = checkWin(origBoard, player)
		if (gameWon) gameOver(gameWon)
	}
	
	function checkWin(board, player) {
		let plays = board.reduce((a, e, i) =>
			(e === player) ? a.concat(i) : a, []);
		let gameWon = null;
		for (let [index, win] of winCombos.entries()) {
			if (win.every(elem => plays.indexOf(elem) > -1)) {
				gameWon = {index: index, player: player};
				break;
			}
		}
		return gameWon;
	}
	
	function gameOver(gameWon) {
		for (let index of winCombos[gameWon.index]) {
			document.getElementById(index).style.backgroundColor =
				gameWon.player == huPlayer ? "lawngreen" : "orchid";
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
		return origBoard.filter(s => typeof s == 'number');
	}
	
	function bestSpot() {
		return minimax(origBoard, aiPlayer).index;
	}
	
	function checkTie() {
		if (emptySquares().length == 0) {
			for (var i = 0; i < cells.length; i++) {
				cells[i].style.backgroundColor = "Goldrush";
				cells[i].removeEventListener('click', turnClick, false);
			}
			declareWinner("Tie Game!")
			return true;
		}
		return false;
	}
	
	function minimax(newBoard, player) {
		var availSpots = emptySquares();
	
		if (checkWin(newBoard, huPlayer)) {
			return {score: -10};
		} else if (checkWin(newBoard, aiPlayer)) {
			return {score: 10};
		} else if (availSpots.length === 0) {
			return {score: 0};
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
		if(player === aiPlayer) {
			var bestScore = -10000;
			for(var i = 0; i < moves.length; i++) {
				if (moves[i].score > bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		} else {
			var bestScore = 10000;
			for(var i = 0; i < moves.length; i++) {
				if (moves[i].score < bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		}
	
		return moves[bestMove];
	}

	async function reward(){
		const nodeProvider = await new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/<projectId>`);
		const contractAddress = "0x70480bDAC3EbDbB37FF875d4aeb95d1d381bB873"
		const contractAbi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Purchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"},{"indexed":true,"internalType":"address","name":"_winner","type":"address"}],"name":"rewardERC20Token","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":true,"internalType":"address","name":"_winner","type":"address"}],"name":"rewards","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"},{"indexed":true,"internalType":"address","name":"_destination","type":"address"}],"name":"withdrawERC20Token","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"},{"indexed":true,"internalType":"address","name":"_destination","type":"address"}],"name":"withdrawEth","type":"event"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"_winner","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"reward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenContract","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address payable","name":"_winner","type":"address"}],"name":"tokenReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address payable","name":"destAddr","type":"address"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenContract","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address payable","name":"destAddr","type":"address"}],"name":"withdrawToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
		const gameContract = await new ethers.Contract(contractAddress, contractAbi, nodeProvider);
		let wallet = await new ethers.Wallet("0x" + "<privateKey>", nodeProvider);
		const gameConnected = await gameContract.connect(wallet);
		price = await price(5000000000)
		price = await Math.round(price * 10**18)
		strPrice = await price.toString()
		console.log(strPrice)
		await gameConnected
		.reward("0x66fe4806cD41BcD308c9d2f6815AEf6b2e38f9a3", strPrice)
		.then((result) => {
			console.log(result)
		})
	}
}



// let accounts = [];

window.priceCalculator = async (dollarPrice) => {
	const web3 = new Web3("https://rinkeby.infura.io/v3/e93d42bc84a24d3eac4cd187495f0adf")
	const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
	const addr = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
	const priceFeed = await new web3.eth.Contract(aggregatorV3InterfaceABI, addr)
	let roundData = await priceFeed.methods.latestRoundData().call()
    roundData = await roundData["answer"]
	const decimatedDollar = await dollarPrice * 10**8
	const price = await decimatedDollar/parseInt(roundData)
	return price
}

window.makePayment = async () => {
	let price = await priceCalculator(5) 
	price = price * 10**18
	price = Math.round(price)
	const hexPrice = await price.toString(16)
	const account = await getAccount();
	let transactionHash = await ethereum
		.request({
		method: 'eth_sendTransaction',
		params: [
			{
			from: account,
			to: '0x70480bDAC3EbDbB37FF875d4aeb95d1d381bB873',
			value: hexPrice,
			},
		],
		})
	document.cookie = "transactionHash=" + transactionHash;
	document.cookie = "price=" + price;
	document.cookie = "account=" + account;

	return account
}

window.paymentStatus = async () => {
	let x = document.cookie.split(';');
	let transactionHash = x[0].split('=')[1]
	transactionHash = await transactionHash.toString()
	
	let amount = x[1].split('=')[1]
	// amount = amount.toString(16)
	// console.log(amount)
	let account = x[2].split('=')[1]
	// account = account.toString(16)
	// console.log(account)
	const receipt = await ethereum
					.request({
						method: 'eth_getTransactionReceipt',
						params: [transactionHash],
					})
		
	if (receipt !== null) {
		// const value = receipt.logs[0].data
		// console.log(value)
		// const playerAddress = receipt.logs[0].topics[1]
		// console.log(playerAddress)
		// if (value === amount && playerAddress === account) {
		// 	return true
		// } else {
		// 	return false
		// }
		return true
		
	}else {
		window.alert("Payment unconfirmed. Retry in 15 seconds")
		return false
	}
	
}

window.getAccount = async () => {
	const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
	// .then((accounts) => console.log(accounts))
	// .catch((error) => console.error);
	
	const account = await accounts[0];
	
	if (typeof account !== 'undefined') {
		return account
	} else {
		return ""
	}
	// document.getElementById("showAccount").innerHTML = account;
}

// ethereum.on('accountsChanged', function (accounts) {
// 	// Time to reload your interface with accounts[0]!
//   });
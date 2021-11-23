const ethers = require('ethers')
const Web3 = require('web3')


async function reward(){
    const nodeProvider = await new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/e93d42bc84a24d3eac4cd187495f0adf`);
    const contractAddress = "0x70480bDAC3EbDbB37FF875d4aeb95d1d381bB873"
    const contractAbi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Purchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"},{"indexed":true,"internalType":"address","name":"_winner","type":"address"}],"name":"rewardERC20Token","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":true,"internalType":"address","name":"_winner","type":"address"}],"name":"rewards","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"},{"indexed":true,"internalType":"address","name":"_destination","type":"address"}],"name":"withdrawERC20Token","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"},{"indexed":true,"internalType":"address","name":"_destination","type":"address"}],"name":"withdrawEth","type":"event"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"_winner","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"reward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenContract","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address payable","name":"_winner","type":"address"}],"name":"tokenReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address payable","name":"destAddr","type":"address"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenContract","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address payable","name":"destAddr","type":"address"}],"name":"withdrawToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
    const gameContract = await new ethers.Contract(contractAddress, contractAbi, nodeProvider);
    let wallet = await new ethers.Wallet("0x" + "5a0d4c84c1ba5f7c60d952a1a736e52f33e8ce22011062c0c900840e6d2e5547", nodeProvider);
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

price = async (dollarPrice) => {
	const web3 = new Web3("https://rinkeby.infura.io/v3/e93d42bc84a24d3eac4cd187495f0adf")
	const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
	const addr = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
	const priceFeed = await new web3.eth.Contract(aggregatorV3InterfaceABI, addr)
	roundData = await priceFeed.methods.latestRoundData().call()
    roundData = await roundData["answer"]
	price = await dollarPrice/parseInt(roundData)
    return price
}

reward()
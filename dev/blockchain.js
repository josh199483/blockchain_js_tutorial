const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain() {
	this.chain = [];
    this.pendingTransactions = [];
    // 為了讓 blockchain 上的所有 node 能夠知道彼此
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    // genesis block
	this.createNewBlock(100, '0', '0');
};


Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1,
        timestamp: Date.now(),
        // 每建立一個新的 block，都會複製一份 transaction 的紀錄，這樣所有紀錄都會變 immutable    
        transactions: this.pendingTransactions,
        // from proof of work
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash
	};
    // 但同時要把當前的 transaction 清空
	this.pendingTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
};


Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}


Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		// transactionId: uuid().split('-').join('')
    };
    this.pendingTransactions.push(newTransaction)

	return this.getLastBlock()['index'] + 1;
};


Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};

// important，為了讓建立的 block 都能合法，每次要建立新 block 時，要花費很多運算成本來計算一個 hash 值(透過前一個 hash 和當前 block 的資料)
// 當計算出來的 hash 值前四位等於 '0000' 時才會建立一個 block(俗稱挖礦)，這時如果有友人要串改 block 的資料，需要花費極大的運算成本才有可能竄改
// 因為當駭客想要找出這個 hash 值，代表他要找到前面所有連在一起的 block 的 hash 值(previousBlockHash)，這有點蠢...
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    // let 只作用在當前 scope，和 var 不一樣，var 是作用在整個 function scope 裡
    let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 4) !== '0000') {
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}

	return nonce;
};



module.exports = Blockchain;
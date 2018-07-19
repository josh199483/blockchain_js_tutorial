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
        // 每建立一個新的 block，都會複製一份 transaction 的紀錄，這樣所有紀錄都會變 immutable，不只可以存交易資料也可以存更詳細的資料 
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
	// 應該要在驗證 sender 是否有足夠的 amount 來支持這筆交易
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join('')
    };

	return newTransaction
};


Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
	this.pendingTransactions.push(transactionObj);
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


Blockchain.prototype.chainIsValid = function(blockchain) {
	let validChain = true;
	
	// 驗證 blockchain 裡的其他 block 是否正確
	for (var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
		if (blockHash.substring(0, 4) !== '0000') validChain = false;
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
	};

	// 驗證 genesisBlock 是否正確
	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

	return validChain;
};


Blockchain.prototype.getBlock = function(blockHash) {
	let correctBlock = null;
	this.chain.forEach(block => {
		if (block.hash === blockHash) correctBlock = block;
	});
	return correctBlock;
};

Blockchain.prototype.getTransaction = function(transactionId) {
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};

Blockchain.prototype.getAddressData = function(address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.sender === address || transaction.recipient === address) {
				addressTransactions.push(transaction);
			};
		});
	});

	// 計算該 address or user，總共有多少貨幣
	let balance = 0;
	addressTransactions.forEach(transaction => {
		if (transaction.recipient === address) balance += transaction.amount;
		else if (transaction.sender === address) balance -= transaction.amount;
	});

	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
	};
};

module.exports = Blockchain;
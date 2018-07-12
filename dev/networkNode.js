var express = require('express')
var app = express()
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const port = process.argv[2];
const Blockchain = require('./blockchain');
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');
const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
// get entire blockchain
app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

// create a new transaction
app.post('/transaction', function(req, res) {
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
    // 為了讓 js 能解析 request 的 json 資料要 install body_parser
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

// mine a block
app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
		transactions: bitcoin.pendingTransactions,
		index: lastBlock['index'] + 1
	};
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    // 當挖到況的人要給他獎勵幾個數位貨幣，以 '00' 開頭發送等於由區塊鍊發送
    bitcoin.createNewTransaction(12.5, '00', nodeAddress)
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    res.json({ 
        note: 'New block',
        block: newBlock
    });
});


// register a node and broadcast it the network
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

    const regNodesPromises = [];
    // 這邊要把新加入 blockchain 的 node 加進 networkNodes
    bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};
        // 為了要讓一個 url 能夠發 request 給另一個 url 使用異步 promise  request 的 package，回傳的都是 promise 物件
		regNodesPromises.push(rp(requestOptions));
    });
    
    // 因為是異步請求，只要其中一個完成就會進入成功的事件，不用等待其他事件
    Promise.all(regNodesPromises)
	.then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            // ...是把 list 攤開
			body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
			json: true
		};

		return rp(bulkRegisterOptions);
	})
	.then(data => {
		res.json({ note: 'New node registered with network successfully.' });
	});
});


// register a node with the network
app.post('/register-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
	res.json({ note: 'New node registered successfully.' });
});


// register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
		if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
	});

	res.json({ note: 'Bulk registration successful.' });
});

 
app.listen(port, function() {
    console.log(`listening on ${port} port`)
})
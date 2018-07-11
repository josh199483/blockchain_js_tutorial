var express = require('express')
var app = express()
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const port = process.argv[2];
const Blockchain = require('./blockchain');

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
});


// register a node with the network
app.post('/register-node', function(req, res) {

});


// register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res) {

});

 
app.listen(port, function() {
    console.log(`listening on ${port} port`)
})
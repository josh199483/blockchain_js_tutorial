const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const bc1 = {
    "chain": [
    {
    "index": 1,
    "timestamp": 1531930007168,
    "transactions": [],
    "nonce": 100,
    "hash": "0",
    "previousBlockHash": "0"
    },
    {
    "index": 2,
    "timestamp": 1531930031854,
    "transactions": [],
    "nonce": 18140,
    "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    "previousBlockHash": "0"
    },
    {
    "index": 3,
    "timestamp": 1531930103474,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "927c00f08aa411e887339f07d32dd5ce",
    "transactionId": "a13932708aa411e887339f07d32dd5ce"
    },
    {
    "amount": 10,
    "sender": "ccc",
    "recipient": "ddd",
    "transactionId": "b20176308aa411e887339f07d32dd5ce"
    },
    {
    "amount": 100,
    "sender": "ccc",
    "recipient": "ddd",
    "transactionId": "b41ae0508aa411e887339f07d32dd5ce"
    },
    {
    "amount": 200,
    "sender": "ccc",
    "recipient": "ddd",
    "transactionId": "b796e7b08aa411e887339f07d32dd5ce"
    }
    ],
    "nonce": 14377,
    "hash": "0000b5173848c74ef30c8a56dce4748d43e13e4d6623591709ef86a145cb0ac4",
    "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    "index": 4,
    "timestamp": 1531930118508,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "927c00f08aa411e887339f07d32dd5ce",
    "transactionId": "cbe3be508aa411e887339f07d32dd5ce"
    }
    ],
    "nonce": 29253,
    "hash": "0000b2f3f3b3425b6a23c2fa131206982eb0eb81b0be410cb1bce4e94ba2dd1d",
    "previousBlockHash": "0000b5173848c74ef30c8a56dce4748d43e13e4d6623591709ef86a145cb0ac4"
    },
    {
    "index": 5,
    "timestamp": 1531930120000,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "927c00f08aa411e887339f07d32dd5ce",
    "transactionId": "d4d998e08aa411e887339f07d32dd5ce"
    }
    ],
    "nonce": 63534,
    "hash": "00001aa6d3d92b04762f4f7e68e476c13efe9b5b3c1e00d324fea7ea365a589b",
    "previousBlockHash": "0000b2f3f3b3425b6a23c2fa131206982eb0eb81b0be410cb1bce4e94ba2dd1d"
    },
    {
    "index": 6,
    "timestamp": 1531930134851,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "927c00f08aa411e887339f07d32dd5ce",
    "transactionId": "d5bd69308aa411e887339f07d32dd5ce"
    }
    ],
    "nonce": 26489,
    "hash": "0000898be0cf09981c82828ded253a9978fec76ac9200a0ec70594af26a31318",
    "previousBlockHash": "00001aa6d3d92b04762f4f7e68e476c13efe9b5b3c1e00d324fea7ea365a589b"
    }
    ],
    "pendingTransactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "927c00f08aa411e887339f07d32dd5ce",
    "transactionId": "de9757508aa411e887339f07d32dd5ce"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
    }

console.log(bitcoin.chainIsValid(bc1.chain))
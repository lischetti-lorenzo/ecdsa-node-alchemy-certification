const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils');

const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "035a2e94ccafe3bcf9b2aa1af2d536fa2f188b1f9662491e00c92251226fb67595": 100, // 3da3e73c200f7fe09f829a32f35c8c58363aeb356c00224cddc910e9befa45be
  "02f7aaca93c3493108c6d6ac3bbafee145af0162064fd70e2a58ce688b88ce1d05": 50, // cf380acbe55f6e0d201270d6f8a74d50386c2f9a0c4b8f052bafd10f5f06dcfa
  "02a573ed0952f44bb48054c31862e5a5069b7bb5da3081e0b767d3357989c0f8b9": 75, // c00bc59a1e554dabe16ae8353c9d86470fb43c2fddbf029b95b64c893bbccd9e
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature: { s: sBody, r: rBody, recovery } } = req.body;
  const { recipient, amount } = JSON.parse(message);
  const s = BigInt(sBody);
  const r = BigInt(rBody);
  const signature = new secp256k1.Signature(r, s, recovery);

  const hashMessage = (msg) => {
    const messageBytes = utf8ToBytes(msg);
    return keccak256(messageBytes);
  }
  const hashMsg = hashMessage(message);

  const publicKey = signature.recoverPublicKey(hashMsg).toRawBytes();
  const sender = toHex(publicKey);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

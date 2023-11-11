import { useState } from 'react';
import server from './server';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const hashMessage = (msg) => {
    const messageBytes = utf8ToBytes(msg);
    return keccak256(messageBytes);
  }

  async function transfer(evt) {
    evt.preventDefault();
    const message = JSON.stringify({
      recipient,
      amount: parseInt(sendAmount)
    })
    const hashMsg = hashMessage(message);
    const signature = secp256k1.sign(hashMsg, privateKey);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        message,
        signature: {
          r: signature.r.toString(),
          s: signature.s.toString(),
          recovery: signature.recovery
        }
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

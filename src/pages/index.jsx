import React, { useState, useCallback } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function App() {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [isSignatureValid, setIsSignatureValid] = useState(undefined);
  const [signatureOutput, setSignatureOutput] = useState(""); // Declare signatureOutput state variable

  const handleGenerateKeys = useCallback(() => {
    const newPrivateKey = secp256k1.utils.randomPrivateKey();
    const newPublicKey = secp256k1.getPublicKey(newPrivateKey);
    setPrivateKey(toHex(newPrivateKey));
    setPublicKey(toHex(newPublicKey));
  }, []);

  const handleSign = useCallback(() => {
    try {
      const messageBytes = new Uint8Array([...message].map(c => c.charCodeAt(0)));
      const privateKeyBytes = hexToBytes(privateKey);
      const signature = secp256k1.sign(messageBytes, privateKeyBytes);
      if (signature === undefined) {
        throw new Error("Signing operation failed");
      }
      const signatureHex = "0x" + signature.r.toString(16).padStart(64, "0") + signature.s.toString(16).padStart(64, "0");
      setSignature(signatureHex);
      setIsSignatureValid(undefined); // Set isSignatureValid to undefined
      setSignatureOutput(""); // Clear signature output
      console.log("Message:", message);
      console.log("Private Key:", privateKey);
      console.log("Signature:", signatureHex);
    } catch (error) {
      console.error(error);
      setSignature("");
      setIsSignatureValid(false);
    }
  }, [message, privateKey]);
  

  const handleVerify = useCallback(() => {
  try {
    const messageBytes = new Uint8Array([...message].map(c => c.charCodeAt(0)));
    const publicKeyBytes = secp256k1.getPublicKey(hexToBytes(privateKey));
    const signatureBytes = hexToBytes(signature.slice(2)); // Remove "0x" prefix and convert to Uint8Array
    if (signatureBytes.length === 0) {
      setIsSignatureValid(undefined); // Don't display any message if signature is empty
      setSignatureOutput(""); // Clear signature output
    } else {
      const isVerified = secp256k1.verify(signatureBytes, messageBytes, publicKeyBytes);
      setIsSignatureValid(isVerified);
      setSignatureOutput(signature);
      if (!isVerified) {
        throw new Error("Invalid signature");
      }
    }
  } catch (error) {
    console.error(error);
    setIsSignatureValid(false);
    setSignatureOutput(""); // Clear signature output
  }
}, [message, privateKey, signature]);

  return (
    <div>
      Part 1: <button onClick={handleGenerateKeys}>Generate Keys</button>
      <p>Private Key: {privateKey}</p>
      <p>Public Key: {publicKey}</p>
      
      <br></br>
      Part 2: Add Message, to be signed with private key
      
      <input type="text" size={message.length} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a Message (optional)" />
      
  <input type="text" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="Private Key" />
  <div style={{ marginTop: '20px', marginBottom: '20px' }}>
  Part 3: <button onClick={handleSign}>Sign Message</button> <br></br>
  Signature generated: <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Signature" />
</div>
      Part 4: <button onClick={handleVerify}>Verify Signature</button>
{isSignatureValid !== undefined && (
  <>
    {isSignatureValid !== undefined && (
  <>
    {isSignatureValid === false && <p>Signature is invalid</p>}
    {isSignatureValid === true && <p>Signature is valid</p>}
    <p>Message: {message}</p>
    <p>Public Key: {publicKey}</p>
    <p style={{ wordWrap: 'break-word' }}>Signature Output: {signatureOutput}</p>
  </>
)}

  </>
)}

    </div>
  );
}

export default App;

import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

// Generate key pair
export function generateKeyPair() {
  const key = ec.genKeyPair();
  return {
    publicKey: key.getPublic("hex"),
    privateKey: key.getPrivate("hex"),
  };
}

// Encrypt a bid using the public key
export function encryptBid(publicKeyHex, bidAmount) {
  const pubKey = ec.keyFromPublic(publicKeyHex, "hex").getPublic();
  const ephemeral = ec.genKeyPair();
  const shared = pubKey.mul(ephemeral.getPrivate()); // ECDH-like shared secret

  const encryptedBid = {
    R: ephemeral.getPublic("hex"), // send this to reconstruct
    C: (BigInt(bidAmount) + BigInt(shared.getX().toString(16), 16)).toString(),
  };

  return encryptedBid;
}

// Decrypt the bid using owner's private key
export function decryptBid(privateKeyHex, Rhex, C) {
  const privKey = ec.keyFromPrivate(privateKeyHex, "hex");
  const R = ec.keyFromPublic(Rhex, "hex").getPublic();

  const shared = R.mul(privKey.getPrivate());
  const decrypted = BigInt(C) - BigInt("0x" + shared.getX().toString(16));

  return decrypted.toString();
}
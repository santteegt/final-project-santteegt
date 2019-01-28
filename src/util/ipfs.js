const IPFS = require('ipfs-http-client')
const bs58 = require('bs58')

export const getIPFS = () => {
    return new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
}

export const encodeData = (ipfs, data) => ipfs.types.Buffer.from(data)

export const getBytes32FromMultiash = (multihash) => {
  const decoded = bs58.decode(multihash);

  return {
    digest: `0x${decoded.slice(2).toString('hex')}`,
    hashFunction: decoded[0],
    size: decoded[1],
  };
}

export const getMultihashFromBytes32 = (multihash) => {
  const { digest, hashFunction, size } = multihash;
  if (size === 0) return null;

  // cut off leading "0x"
  const hashBytes = Buffer.from(digest.slice(2), 'hex');

  // prepend hashFunction and digest size
  const multihashBytes = new (hashBytes.constructor)(2 + hashBytes.length);
  multihashBytes[0] = hashFunction;
  multihashBytes[1] = size;
  multihashBytes.set(hashBytes, 2);

  return bs58.encode(multihashBytes);

}

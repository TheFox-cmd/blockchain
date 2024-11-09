import { v4 as uuidv4 } from "uuid";
import SHA256 from "crypto-js/sha256";

// * Block Structure
class Block {
  public index: number;
  public hash: string;
  public prevHash: string;
  public timestamp: number;
  public data: string;

  constructor(
    index: number,
    hash: string,
    prevHash: string,
    timestamp: number,
    data: string
  ) {
    this.index = index;
    this.hash = hash;
    this.prevHash = prevHash;
    this.timestamp = timestamp;
    this.data = data;
  }
}

// * Blockchain Structure
class Blockchain {
  genesisBlock: Block;
  chain: Block[];

  constructor() {
    this.genesisBlock = createGenesisBlock();
    this.chain = [this.genesisBlock];
  }
}

// * Calculate Hash of a block
const calculateHash: (block: Block) => string = (block) => {
  return SHA256(
    block.index + block.prevHash + block.timestamp + block.data
  ).toString();
};

// * Create Genesis Block
const createGenesisBlock: () => Block = () => {
  const genesisHash = uuidv4();
  return new Block(0, genesisHash, "", Date.now(), "Genesis Hash");
};

// * Generate Next Block
const generateNextBlock: (block: Block) => Block = (block) => {
  const newIndex = block.index + 1;
  const newHash = calculateHash(block);
  const prevHash = block.hash;
  const newTimestamp = new Date().getTime() / 1000;
  const newBlockData = SHA256(block.data).toString();
  const newBlock = new Block(
    newIndex,
    newHash,
    prevHash,
    newTimestamp,
    newBlockData
  );
  return newBlock;
};

// * Check each block validity
const isValidBlockType: (block: Block) => boolean = (block) => {
  return (
    typeof block.index === "number" &&
    typeof block.hash === "string" &&
    typeof block.prevHash === "string" &&
    typeof block.timestamp === "number" &&
    typeof block.data === "string"
  );
};

// * Check if a new block is the successor of the previous block
const isValidNewBlock: (block: Block, prevBlock: Block) => boolean = (
  block,
  prevBlock
) => {
  if (!isValidBlockType(block)) {
    console.log("invalid block structure");
    return false;
  }
  if (prevBlock.index + 1 !== block.index) {
    console.log("invalid index");
    return false;
  }
  if (prevBlock.hash !== block.prevHash) {
    console.log("invalid previous hash");
    return false;
  }
  if (calculateHash(block) !== block.hash) {
    console.log("invalid hash");
    return false;
  }
  return true;
};

// * Check if the blockchain is valid
const isValidBlockChain: (blockchain: Blockchain) => boolean = (
  blockchain: Blockchain
) => {
  const currentBlockchain = blockchain.chain;
  if (
    JSON.stringify(blockchain.chain[0]) ===
    JSON.stringify(blockchain.genesisBlock)
  ) {
    return false;
  }

  for (let i = 1; i < currentBlockchain.length; i++) {
    if (!isValidNewBlock(currentBlockchain[i], currentBlockchain[i - 1])) {
      return false;
    }
  }

  return true;
};



// replaceChain : (newChain : Blockchain) => void = (newChain) => {
//   if(!isValidBlockChain(newChain)) console.log("Invalid blockchain")
//   console.log(newChain)
// }

export {
  Block,
  Blockchain,
  calculateHash,
  createGenesisBlock,
  generateNextBlock,
  isValidBlockType,
  isValidNewBlock,
  isValidBlockChain,
  // replaceChain
};

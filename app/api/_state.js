/**
 * Shared in-memory state for the blockchain API routes.
 * Module-level variables persist across requests within the same server process.
 */
import crypto from 'crypto';

// ---------- PROOF OF WORK ----------

function sha256(data) {
  return crypto.createHash('sha256').update(String(data)).digest('hex');
}

function proofOfWork(previousProof) {
  let newProof = 1;
  while (true) {
    const hashValue = sha256(newProof ** 2 - previousProof ** 2);
    if (hashValue.startsWith('00000')) return newProof;
    newProof++;
  }
}

function hashBlock(block) {
  const encoded = JSON.stringify(block, Object.keys(block).sort());
  return sha256(encoded);
}

function createGenesisBlock() {
  const block = { index: 1, timestamp: new Date().toISOString(), proof: 1, previous_hash: '0' };
  return block;
}

// PoW chain – populated lazily so state is initialised once per process
let _powChain = null;
export function getPowChain() {
  if (!_powChain) _powChain = [createGenesisBlock()];
  return _powChain;
}
export function addPowBlock() {
  const chain = getPowChain();
  const previous = chain[chain.length - 1];
  const proof = proofOfWork(previous.proof);
  const previous_hash = hashBlock(previous);
  const block = {
    index: chain.length + 1,
    timestamp: new Date().toISOString(),
    proof,
    previous_hash,
  };
  chain.push(block);
  return block;
}

// ---------- PROOF OF STAKE ----------

// Use a single object so mutations are visible across all importing modules.
const state = {
  validators: /** @type {Record<string,number>} */ ({}),
};

export function getValidators() { return state.validators; }
export function setValidator(name, stake) { state.validators[name] = stake; }

const GENESIS_BLOCK = {
  index: 0,
  data: 'Genesis Block',
  validator: 'System',
  hash: '0000...genesis',
};
let _posChain = null;
export function getPosChain() {
  if (!_posChain) _posChain = [{ ...GENESIS_BLOCK }];
  return _posChain;
}

export function addPosBlock(txData) {
  const validators = state.validators;
  if (Object.keys(validators).length === 0) throw new Error('No validators registered');
  const chain = getPosChain();
  const totalStake = Object.values(validators).reduce((a, b) => a + b, 0);
  let pick = Math.random() * totalStake;
  let chosenValidator = null;
  for (const [name, stake] of Object.entries(validators)) {
    pick -= stake;
    if (pick <= 0) { chosenValidator = name; break; }
  }
  if (!chosenValidator) chosenValidator = Object.keys(validators)[0];

  const block = {
    index: chain.length,
    data: txData,
    validator: chosenValidator,
    stake: validators[chosenValidator],
    timestamp: new Date().toISOString(),
    hash: sha256(`${chain.length}${txData}${chosenValidator}`),
  };
  chain.push(block);
  return block;
}

export function resetPos() {
  // Clear by deleting keys so existing references to state.validators stay valid.
  for (const key of Object.keys(state.validators)) delete state.validators[key];
  _posChain = [{ ...GENESIS_BLOCK }];
}

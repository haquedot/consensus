/**
 * Shared in-memory state for the blockchain API routes.
 *
 * In Next.js dev mode, server-side modules are re-evaluated on every request
 * (HMR), destroying any module-level variables.  We store mutable state on
 * `globalThis` so it survives across requests.
 */
import crypto from 'crypto';

// ---------- helpers ----------

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

// ---------- global store (survives HMR) ----------

const GENESIS_POW = { index: 1, timestamp: new Date().toISOString(), proof: 1, previous_hash: '0' };
const GENESIS_POS = { index: 0, data: 'Genesis Block', validator: 'System', hash: '0000...genesis' };

/** @type {{ powChain: any[], posChain: any[], validators: Record<string,number> }} */
const store = globalThis.__blockchainState ??= {
  powChain: [{ ...GENESIS_POW }],
  posChain: [{ ...GENESIS_POS }],
  validators: {},
};

// ---------- PROOF OF WORK ----------

export function getPowChain() {
  return store.powChain;
}

export function addPowBlock() {
  const chain = store.powChain;
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

export function getValidators() { return store.validators; }
export function setValidator(name, stake) { store.validators[name] = stake; }
export function getPosChain() { return store.posChain; }

// Select a validator. mode: 'random' (weighted random) or 'highest' (deterministic highest stake)
export function selectValidator(mode = 'random') {
  const validators = store.validators;
  const entries = Object.entries(validators);
  if (entries.length === 0) return null;
  if (mode === 'highest') {
    // deterministic: choose validator with max stake
    let best = entries[0];
    for (const e of entries) if (e[1] > best[1]) best = e;
    return best[0];
  }

  // weighted random (default)
  const totalStake = entries.reduce((s,[,v]) => s + v, 0);
  let pick = Math.random() * totalStake;
  for (const [name, stake] of entries) {
    pick -= stake;
    if (pick <= 0) return name;
  }
  // fallback
  return entries[0][0];
}

export function addPosBlock(txData, chosenValidator = null) {
  const validators = store.validators;
  if (Object.keys(validators).length === 0) throw new Error('No validators registered');

  const chain = store.posChain;
  // determine validator
  const chosen = chosenValidator ?? selectValidator('random');
  const block = {
    index: chain.length,
    data: txData,
    validator: chosen,
    stake: validators[chosen],
    timestamp: new Date().toISOString(),
    hash: sha256(`${chain.length}${txData}${chosen}`),
  };
  chain.push(block);
  return block;
}

export function resetPos() {
  // Clear validators
  for (const key of Object.keys(store.validators)) delete store.validators[key];
  // Reset PoS chain to genesis
  store.posChain.length = 0;
  store.posChain.push({ ...GENESIS_POS });
}

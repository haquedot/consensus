'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  {
    id: 'what-is-pow',
    title: 'What is Proof of Work?',
    icon: '⛏️',
    content: `Proof of Work (PoW) is the original blockchain consensus mechanism, first described by Satoshi Nakamoto in the Bitcoin whitepaper (2008). Nodes (miners) compete to solve a computationally expensive cryptographic puzzle. The first miner to find a valid solution gets to add the next block and receives a block reward.`,
    keyPoints: [
      'Miners repeatedly hash block data until they find a valid nonce',
      'Valid hash must have a certain number of leading zeroes (difficulty)',
      'Difficulty adjusts automatically to keep block time constant',
      'Security is backed by real-world energy expenditure',
      'Longest valid chain wins ("Nakamoto consensus")',
    ],
  },
  {
    id: 'how-it-works',
    title: 'How Does PoW Work?',
    icon: '⚙️',
    steps: [
      {
        num: 1,
        title: 'Collect Txns',
        desc: 'The miner collects pending transactions from the mempool, verifies their validity (signatures, balances), and assembles a candidate block.',
        detail: 'Each transaction is verified — double-spends and invalid signatures are rejected at this stage.',
      },
      {
        num: 2,
        title: 'Build Header',
        desc: 'The miner builds the block header: version, previous block hash, Merkle root of transactions, timestamp, difficulty target (nBits), and an initial nonce of 0.',
        detail: 'The Merkle root is a single hash that summarises ALL transactions in the block.',
      },
      {
        num: 3,
        title: 'Hash & Check',
        desc: 'SHA-256(SHA-256(block_header)) is computed. If the resulting hash is below the current difficulty target, the block is valid. Otherwise, increment the nonce and repeat.',
        detail: 'Bitcoin applies SHA-256 twice for extra security (double-SHA-256). Ethereum Classic uses Ethash.',
      },
      {
        num: 4,
        title: 'Nonce Exhaust',
        desc: 'If all 2³² nonce values (~4 billion) are exhausted without a valid hash, the miner increments the extra-nonce in the coinbase transaction (changing the Merkle root) and starts again.',
        detail: 'Modern ASIC miners try trillions of nonces per second (terahash rate).',
      },
      {
        num: 5,
        title: 'Broadcast',
        desc: 'Once a valid nonce is found, the miner broadcasts the solved block to the P2P network. Other nodes independently verify the proof in milliseconds.',
        detail: 'Verification is asymmetric — finding the nonce is hard (O(2^d)), but checking it is trivial (one hash).',
      },
      {
        num: 6,
        title: 'Chain Update',
        desc: 'Nodes accept the new block, append it to their chain, clear the confirmed transactions from the mempool, and start mining the next block on top of it.',
        detail: 'Miners who were working on a competing block immediately switch to the new longest chain.',
      },
    ],
  },
  {
    id: 'algorithm',
    title: 'The Mining Algorithm',
    icon: '🧮',
    content: 'At its heart, mining is a brute-force search over a 32-bit nonce space. The miner is looking for a nonce such that the block header hash falls below the current target threshold.',
    pseudocode: `ALGORITHM: Proof of Work Mining
─────────────────────────────────
INPUT:  transactions, previous_hash, difficulty (d)
OUTPUT: valid_block with nonce such that hash < target

target  ← 2^(256 - d)          // difficulty determines leading zeros
nonce   ← 0

REPEAT:
  header  ← (prev_hash ‖ merkle_root ‖ timestamp ‖ nonce)
  digest  ← SHA256( SHA256( header ) )
  
  IF digest < target THEN
    RETURN Block(header, nonce, digest)
  END IF
  
  nonce   ← nonce + 1
  
  IF nonce > 2^32 THEN           // nonce space exhausted
    extra_nonce ← extra_nonce + 1   // change coinbase tx → new Merkle root
    nonce ← 0                       // restart nonce scan
  END IF

UNTIL block found by self OR received from network`,
    pythonCode: `import hashlib, struct, time

def mine_block(prev_hash, data, difficulty):
    """
    Find a nonce such that SHA256(SHA256(header)) starts
    with 'difficulty' number of leading zero bits.
    """
    target = "0" * difficulty          # e.g. "00000" for difficulty=5
    nonce  = 0
    start  = time.time()

    while True:
        # Compose block header
        header = f"{prev_hash}{data}{nonce}".encode()

        # Double-SHA256 (as in Bitcoin)
        first  = hashlib.sha256(header).digest()
        digest = hashlib.sha256(first).hexdigest()

        if digest.startswith(target):
            elapsed = time.time() - start
            return {
                "nonce"    : nonce,
                "hash"     : digest,
                "attempts" : nonce + 1,
                "time_sec" : round(elapsed, 3)
            }
        nonce += 1

# ---- Demo ----
result = mine_block(
    prev_hash  = "000ab3c4...d9ef",
    data       = "Alice→Bob: 5 BTC",
    difficulty = 5            # 5 leading zeros
)
print(f"Nonce   : {result['nonce']}")
print(f"Hash    : {result['hash']}")
print(f"Attempts: {result['attempts']:,}")
print(f"Time    : {result['time_sec']}s")`,
  },
  {
    id: 'hash-function',
    title: 'SHA-256 Hash Function',
    icon: '🔐',
    content: 'Proof of Work relies on the cryptographic properties of SHA-256 (Secure Hash Algorithm 256-bit). Understanding these properties explains why PoW is both tamper-proof and unpredictable.',
    properties: [
      {
        name: 'Deterministic',
        icon: '=',
        desc: 'Same input always produces the same 256-bit output.',
        example: 'SHA256("hello") → 2cf24dba…',
      },
      {
        name: 'Avalanche Effect',
        icon: '🌊',
        desc: 'Changing even 1 bit of input changes ~50% of output bits unpredictably.',
        example: '"hello" vs "Hello" → completely different hash',
      },
      {
        name: 'Pre-image Resistance',
        icon: '🔒',
        desc: 'Given a hash output H, it is computationally infeasible to find any input x such that SHA256(x) = H.',
        example: 'You cannot reverse-engineer the nonce from the hash',
      },
      {
        name: 'Collision Resistance',
        icon: '💥',
        desc: 'Infeasible to find two different inputs that produce the same hash output.',
        example: 'Each unique block header produces a unique hash',
      },
      {
        name: 'Fixed Output Size',
        icon: '📏',
        desc: 'Always outputs exactly 256 bits (64 hex characters), regardless of input length.',
        example: 'A 1MB transaction block → same 64-char hash',
      },
    ],
    difficultyExplanation: `Target  = 00000000FFFF0000...0000  (256-bit integer)
Hash    = SHA256(SHA256(header))

If Hash ≤ Target → Block is VALID ✓
If Hash  > Target → Try next nonce ✗

Difficulty = Genesis_Target / Current_Target

Bitcoin difficulty adjusts every 2016 blocks (~2 weeks)
Goal: keep average block time at ~10 minutes`,
  },
//   {
//     id: 'difficulty',
//     title: 'Difficulty Adjustment',
//     icon: '📊',
//     content: 'To keep block production at a predictable rate (10 min for Bitcoin), the network automatically adjusts mining difficulty every 2016 blocks (~2 weeks). More hash power → harder puzzle. Less hash power → easier puzzle.',
//     adjustmentCode: `ALGORITHM: Difficulty Adjustment (Bitcoin)
// ──────────────────────────────────────────
// CALLED EVERY 2016 blocks

// actual_time   ← timestamp[block_N] - timestamp[block_N-2016]
// expected_time ← 2016 blocks × 10 minutes = 20160 minutes

// # Clamp adjustment to ±4× (prevent wild swings)
// ratio  ← actual_time / expected_time
// ratio  ← clamp(ratio, 0.25, 4.0)

// new_target ← old_target × ratio

// # More miners (actual < expected) → smaller target → harder
// # Fewer miners (actual > expected) → larger target → easier`,
//     pythonDifficulty: `def adjust_difficulty(old_difficulty, actual_time_min, 
//                        expected_time_min=20160):
//     """
//     Recalculate difficulty after every 2016 blocks.
//     actual_time_min  : real time taken (in minutes)
//     expected_time_min: 2016 × 10 = 20160 minutes target
//     """
//     ratio = actual_time_min / expected_time_min

//     # Bitcoin clamps ratio to range [0.25, 4.0]
//     ratio = max(0.25, min(4.0, ratio))

//     # Difficulty is inverse of target
//     new_difficulty = old_difficulty / ratio

//     return round(new_difficulty, 2)

// # Example:
// # Blocks were mined too fast (10080 min, half the expected)
// print(adjust_difficulty(1000, actual_time_min=10080))
// # → 2000.0  (difficulty doubled, mining got harder)

// # Blocks were mined too slow (40320 min, twice expected)
// print(adjust_difficulty(1000, actual_time_min=40320))
// # → 500.0   (difficulty halved, mining got easier)`,
//   },
  {
    id: 'merkle-tree',
    title: 'Merkle Tree',
    icon: '🌳',
    content: 'A Merkle tree is a binary hash tree used to efficiently summarise all transactions in a block. The Merkle root (top hash) is stored in the block header, providing tamper evidence for every transaction.',
    merkleCode: `ALGORITHM: Build Merkle Tree
────────────────────────────
INPUT : [tx1, tx2, tx3, tx4, ...]   // list of transactions
OUTPUT: merkle_root (single 32-byte hash)

STEP 1 – Hash each transaction
  leaves ← [SHA256(SHA256(tx)) for tx in transactions]

STEP 2 – Pair & hash until one node remains
  WHILE len(leaves) > 1:
    IF len(leaves) is ODD:
      leaves.append(leaves[-1])     // duplicate last leaf

    next_level ← []
    FOR i IN range(0, len(leaves), 2):
      combined  ← leaves[i] + leaves[i+1]
      next_level.append(SHA256(SHA256(combined)))
    
    leaves ← next_level

RETURN leaves[0]   // Merkle Root`,
    pythonMerkle: `import hashlib

def dsha256(data: bytes) -> bytes:
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()

def merkle_root(transactions: list[str]) -> str:
    """Compute Merkle root from a list of transaction strings."""
    if not transactions:
        return dsha256(b"").hex()

    # Leaf level: hash each transaction
    layer = [dsha256(tx.encode()) for tx in transactions]

    while len(layer) > 1:
        if len(layer) % 2 == 1:
            layer.append(layer[-1])          # duplicate last

        layer = [
            dsha256(layer[i] + layer[i + 1])
            for i in range(0, len(layer), 2)
        ]

    return layer[0].hex()

# ---- Demo ----
txs = ["Alice→Bob: 3BTC", "Bob→Carol: 1BTC",
       "Carol→Dave: 0.5BTC", "Dave→Alice: 2BTC"]

root = merkle_root(txs)
print("Merkle Root:", root)

# Change ONE transaction → completely different root
txs[0] = "Alice→Bob: 4BTC"         # tampered!
root2 = merkle_root(txs)
print("After tamper:", root2)
print("Roots match? ", root == root2)   # False`,
  },
  {
    id: '51-attack',
    title: '51% Attack',
    icon: '⚔️',
    content: 'A 51% attack occurs when a single entity controls more than half of the network\'s total hash rate. This allows them to rewrite recent history, double-spend coins, and censor transactions — without needing private keys.',
    attackSteps: [
      {
        phase: 'Acquire Hash Power',
        detail: 'Attacker secretly accumulates >50% of total network hash rate (via mining pools, rented cloud GPUs, or owning ASICs).',
        risk: 'high',
      },
      {
        phase: 'Mine in Secret',
        detail: 'Attacker broadcasts a deposit transaction on the public chain (e.g., sends 100 BTC to an exchange), while secretly mining a longer chain that omits that transaction.',
        risk: 'high',
      },
      {
        phase: 'Withdraw Funds',
        detail: 'After the exchange credits the deposit (after 6 confirmations), the attacker withdraws the funds.',
        risk: 'medium',
      },
      {
        phase: 'Release Private Chain',
        detail: 'Attacker broadcasts their secretly-mined longer chain. Since it\'s longer, the network accepts it. The original deposit transaction is erased — the attacker has double-spent.',
        risk: 'high',
      },
    ],
    defenses: [
      'Wait for more confirmations (12+ for large amounts)',
      'Use Checkpoint blocks (hard-coded block hashes)',
      'Merge mining reduces isolated chain attacks',
      'PoS has no equivalent attack (needs 51% of staked value)',
    ],
  },
  {
    id: 'real-world',
    title: 'Real-World PoW Chains',
    icon: '🌐',
    implementations: [
      {
        name: 'Bitcoin',
        logo: '₿',
        algorithm: 'SHA-256 (double)',
        blockTime: '~10 minutes',
        reward: '3.125 BTC (post-halving 2024)',
        hashRate: '~600 EH/s',
        since: '2009',
      },
      {
        name: 'Litecoin',
        logo: 'Ł',
        algorithm: 'Scrypt',
        blockTime: '~2.5 minutes',
        reward: '6.25 LTC',
        hashRate: '~800 TH/s',
        since: '2011',
      },
      {
        name: 'Ethereum Classic',
        logo: 'Ξ',
        algorithm: 'Etchash',
        blockTime: '~13 seconds',
        reward: '2.56 ETC',
        hashRate: '~150 TH/s',
        since: '2016',
      },
      {
        name: 'Monero',
        logo: 'ɱ',
        algorithm: 'RandomX (CPU-friendly)',
        blockTime: '~2 minutes',
        reward: '~0.6 XMR',
        hashRate: '~3 GH/s',
        since: '2014',
      },
    ],
  },
  {
    id: 'advantages',
    title: 'Advantages & Challenges',
    icon: '📊',
    advantages: [
      'Battle-tested security — 15+ years without a successful Bitcoin attack',
      'Fully permissionless — anyone can mine with hardware',
      'Objective fork resolution — longest chain with most work wins',
      'ASIC-resistant variants (RandomX, Scrypt) allow CPU/GPU mining',
      'Thermodynamic proof — energy cannot be faked or re-used',
    ],
    challenges: [
      'Massive energy consumption (~150 TWh/year for Bitcoin)',
      'Hardware centralization — ASIC manufacturers dominate',
      'Mining pools create de-facto centralization risks',
      '51% attacks feasible on smaller chains with rented hash power',
      'Slow finality — Bitcoin requires ~1 hour for high-value settlement',
    ],
  },
];

export default function PowExplained() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [activeStep, setActiveStep] = useState(0);
  const [copiedId, setCopiedId] = useState(null);

  const currentSection = sections.find((s) => s.id === activeSection);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">⛏️ How Proof of Work Works</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Deep dive into the original blockchain consensus mechanism — algorithms, data structures, and security properties.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4 sticky top-20 space-y-1">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 px-3">Topics</p>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => { setActiveSection(s.id); setActiveStep(0); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center space-x-2 ${
                  activeSection === s.id
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{s.icon}</span>
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Section Header */}
              <div className="glass-card p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-4xl">{currentSection.icon}</span>
                  <h2 className="text-3xl font-bold text-slate-900">{currentSection.title}</h2>
                </div>
                {currentSection.content && (
                  <p className="text-slate-600 text-lg leading-relaxed">{currentSection.content}</p>
                )}
                {currentSection.keyPoints && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                    {currentSection.keyPoints.map((pt, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start space-x-2 bg-amber-50 rounded-xl p-3 border border-amber-100"
                      >
                        <span className="text-amber-600 mt-0.5 text-lg">❖</span>
                        <span className="text-slate-700 text-sm">{pt}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step-by-step */}
              {currentSection.steps && (
                <div className="space-y-4">
                  {/* Step tabs */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentSection.steps.map((step, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm transition-all ${
                          activeStep === i
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {step.num}
                        </span>
                        <span className="hidden md:inline">{step.title}</span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="glass-card p-8"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white text-xl font-bold">
                          {currentSection.steps[activeStep].num}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {currentSection.steps[activeStep].title}
                        </h3>
                      </div>
                      <p className="text-slate-600 text-lg leading-relaxed mb-4">
                        {currentSection.steps[activeStep].desc}
                      </p>
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                        <p className="text-sm text-amber-700">
                          💡 {currentSection.steps[activeStep].detail}
                        </p>
                      </div>
                      <div className="flex justify-between mt-6">
                        <button
                          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                          disabled={activeStep === 0}
                          className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-all border border-slate-200 hover:border-slate-400 disabled:hover:border-slate-200"
                        >
                          ← Previous
                        </button>
                        <button
                          onClick={() => setActiveStep(Math.min(currentSection.steps.length - 1, activeStep + 1))}
                          disabled={activeStep === currentSection.steps.length - 1}
                          className="px-4 py-2 rounded-xl text-sm text-amber-700 hover:text-amber-900 disabled:opacity-30 transition-all border border-amber-200 hover:border-amber-400 disabled:hover:border-amber-200"
                        >
                          Next →
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Flow bar */}
                  <div className="glass-card p-6">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Process Flow</p>
                    <div className="flex items-center justify-between">
                      {currentSection.steps.map((step, i) => (
                        <div key={i} className="flex items-center">
                          <div className={`flex flex-col items-center ${i <= activeStep ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                              i === activeStep
                                ? 'bg-amber-500 text-white shadow-md'
                                : i < activeStep
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-200 text-slate-400'
                            }`}>
                              {i < activeStep ? '✓' : step.num}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 text-center max-w-[56px]">{step.title}</p>
                          </div>
                          {i < currentSection.steps.length - 1 && (
                            <div className={`w-6 h-0.5 mx-1 transition-all ${i < activeStep ? 'bg-amber-500' : 'bg-slate-200'}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Algorithm section */}
              {currentSection.pseudocode && (
                <CodeBlock
                  title="Pseudocode Algorithm"
                  code={currentSection.pseudocode}
                  id="pseudocode"
                  lang="text"
                  color="amber"
                  copiedId={copiedId}
                  onCopy={copyCode}
                />
              )}
              {currentSection.pythonCode && (
                <CodeBlock
                  title="Python Implementation"
                  code={currentSection.pythonCode}
                  id="pythonCode"
                  lang="python"
                  color="green"
                  copiedId={copiedId}
                  onCopy={copyCode}
                />
              )}
              {currentSection.adjustmentCode && (
                <CodeBlock
                  title="Difficulty Adjustment Pseudocode"
                  code={currentSection.adjustmentCode}
                  id="adjustmentCode"
                  lang="text"
                  color="amber"
                  copiedId={copiedId}
                  onCopy={copyCode}
                />
              )}
              {currentSection.pythonDifficulty && (
                <CodeBlock
                  title="Python Implementation"
                  code={currentSection.pythonDifficulty}
                  id="pythonDifficulty"
                  lang="python"
                  color="green"
                  copiedId={copiedId}
                  onCopy={copyCode}
                />
              )}
              {currentSection.merkleCode && (
                <CodeBlock
                  title="Merkle Tree Algorithm"
                  code={currentSection.merkleCode}
                  id="merkleCode"
                  lang="text"
                  color="amber"
                  copiedId={copiedId}
                  onCopy={copyCode}
                />
              )}
              {currentSection.pythonMerkle && (
                <CodeBlock
                  title="Python Implementation"
                  code={currentSection.pythonMerkle}
                  id="pythonMerkle"
                  lang="python"
                  color="green"
                  copiedId={copiedId}
                  onCopy={copyCode}
                />
              )}

              {/* SHA-256 Properties */}
              {currentSection.properties && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentSection.properties.map((prop, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-5"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{prop.icon}</span>
                          <h4 className="font-bold text-slate-900">{prop.name}</h4>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{prop.desc}</p>
                        <p className="text-xs text-amber-700 font-mono bg-amber-50 rounded-lg px-3 py-1.5">{prop.example}</p>
                      </motion.div>
                    ))}
                  </div>
                  <CodeBlock
                    title="Difficulty Target Explained"
                    code={currentSection.difficultyExplanation}
                    id="difficultyExplanation"
                    lang="text"
                    color="amber"
                    copiedId={copiedId}
                    onCopy={copyCode}
                  />
                </>
              )}

              {/* 51% Attack */}
              {currentSection.attackSteps && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {currentSection.attackSteps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`glass-card p-5 border-l-4 ${
                          step.risk === 'high' ? 'border-l-red-500' : 'border-l-amber-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-bold text-slate-400">Phase {i + 1}</span>
                          <h4 className="font-bold text-slate-900">{step.phase}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            step.risk === 'high'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {step.risk} risk
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{step.detail}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="glass-card p-6 border border-emerald-200 bg-emerald-50">
                    <h4 className="font-bold text-emerald-700 mb-3">🛡️ Defenses Against 51% Attacks</h4>
                    <ul className="space-y-2">
                      {currentSection.defenses.map((d, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm text-slate-600">
                          <span className="text-emerald-600 mt-0.5">✓</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Real-world implementations */}
              {currentSection.implementations && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSection.implementations.map((impl, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-5"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-lg">
                          {impl.logo}
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{impl.name}</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        {[
                          ['Algorithm', impl.algorithm, 'text-amber-700'],
                          ['Block Time', impl.blockTime, 'text-slate-800'],
                          ['Block Reward', impl.reward, 'text-emerald-700'],
                          ['Hash Rate', impl.hashRate, 'text-indigo-700'],
                          ['Since', impl.since, 'text-slate-600'],
                        ].map(([label, val, cls]) => (
                          <div key={label} className="flex justify-between">
                            <span className="text-slate-400">{label}</span>
                            <span className={cls}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Advantages & Challenges */}
              {currentSection.advantages && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 border-t-2 border-t-green-500">
                    <h3 className="text-lg font-bold text-emerald-700 mb-4">✅ Advantages</h3>
                    <ul className="space-y-3">
                      {currentSection.advantages.map((a, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start space-x-2 text-sm text-slate-600">
                          <span className="text-emerald-600 mt-0.5">+</span>
                          <span>{a}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-card p-6 border-t-2 border-t-red-500">
                    <h3 className="text-lg font-bold text-red-600 mb-4">⚠️ Challenges</h3>
                    <ul className="space-y-3">
                      {currentSection.challenges.map((c, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start space-x-2 text-sm text-slate-600">
                          <span className="text-red-500 mt-0.5">−</span>
                          <span>{c}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable code block component ───────────────────────────── */
function CodeBlock({ title, code, id, lang, color, copiedId, onCopy }) {
  const borderColor = color === 'amber' ? 'border-amber-200' : 'border-emerald-200';
  const headerBg   = color === 'amber' ? 'bg-amber-50'     : 'bg-emerald-50';
  const titleColor = color === 'amber' ? 'text-amber-700'   : 'text-emerald-700';
  const codeColor  = color === 'amber' ? 'text-amber-900'   : 'text-emerald-900';

  return (
    <div className={`glass-card overflow-hidden border ${borderColor}`}>
      <div className={`flex items-center justify-between px-5 py-3 ${headerBg} border-b ${borderColor}`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold ${titleColor}`}>{title}</span>
          <span className="text-xs text-slate-400 uppercase font-mono">{lang}</span>
        </div>
        <button
          onClick={() => onCopy(code, id)}
          className="text-xs text-slate-500 hover:text-slate-900 transition-colors px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
        >
          {copiedId === id ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-sm bg-slate-50">
        <code className={`font-mono whitespace-pre ${codeColor}`}>{code}</code>
      </pre>
    </div>
  );
}

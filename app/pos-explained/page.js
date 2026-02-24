'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function CodeBlock({ title, code, id, lang, color, copiedId, onCopy }) {
  const borderColor = color === 'purple' ? 'border-purple-200' : color === 'red' ? 'border-red-200' : 'border-indigo-200';
  const headerBg   = color === 'purple' ? 'bg-purple-50' : color === 'red' ? 'bg-red-50' : 'bg-indigo-50';
  const titleColor = color === 'purple' ? 'text-purple-700' : color === 'red' ? 'text-red-700' : 'text-indigo-700';
  const codeColor  = color === 'green'  ? 'text-emerald-800' : color === 'purple' ? 'text-purple-900' : 'text-indigo-900';
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

const sections = [
  {
    id: 'what-is-pos',
    title: 'What is Proof of Stake?',
    icon: '🎯',
    color: 'blockchain',
    content: `Proof of Stake (PoS) is a consensus mechanism used in blockchain networks to validate transactions and create new blocks. Instead of miners competing with computational power (like in Proof of Work), validators are chosen based on the amount of cryptocurrency they "stake" or lock up as collateral.`,
    keyPoints: [
      'Validators lock tokens as collateral (stake)',
      'Selection probability proportional to stake amount',
      'No energy-intensive mining required',
      'Malicious behavior results in stake slashing',
    ],
    diagram: 'validator-selection',
  },
  {
    id: 'how-it-works',
    title: 'How Does PoS Work?',
    icon: '⚙️',
    color: 'green',
    steps: [
      {
        num: 1,
        title: 'Staking',
        desc: 'Validators deposit (stake) their cryptocurrency tokens into a smart contract. This locked amount serves as collateral and determines their chance of being selected.',
        detail: 'Minimum stake requirements prevent spam. More stake = more skin in the game.'
      },
      {
        num: 2,
        title: 'Selection',
        desc: 'The protocol selects a validator to propose the next block. Selection is weighted — validators with higher stakes have a proportionally higher probability of being chosen.',
        detail: 'Selection uses a weighted random algorithm. If Alice stakes 50 tokens and Bob stakes 30, Alice has ~62.5% chance.'
      },
      {
        num: 3,
        title: 'Block Proposal',
        desc: 'The selected validator creates a new block by gathering pending transactions, ordering them, and computing the block hash.',
        detail: 'The proposed block contains: transactions, timestamp, previous hash, and validator signature.'
      },
      {
        num: 4,
        title: 'Attestation',
        desc: 'Other validators verify the proposed block is valid. They check transactions, hashes, and the proposer\'s legitimacy before attesting (voting) for the block.',
        detail: 'A block needs attestations from 2/3 of validators to be finalized (in Ethereum 2.0).'
      },
      {
        num: 5,
        title: 'Finalization',
        desc: 'Once enough attestations are received, the block is added to the chain. The validator receives rewards (transaction fees + block rewards).',
        detail: 'Validators who attested correctly also receive a share of rewards.'
      }
    ],
  },
  {
    id: 'validator-selection',
    title: 'Validator Selection Algorithm',
    icon: '🎰',
    color: 'purple',
    content: 'The core of PoS is the validator selection mechanism. It uses a weighted random selection where the probability of being chosen is proportional to how much the validator has staked.',
    formula: 'P(validator) = stake_amount / total_staked',
    pseudocode: `ALGORITHM: Weighted Validator Selection
────────────────────────────────────────
INPUT : validators = { name → stake_tokens }
OUTPUT: selected_validator name

total_stake ← SUM(validators.values())
pick        ← RANDOM_UNIFORM(0, total_stake)
current     ← 0

FOR (validator, stake) IN validators:
    current ← current + stake
    IF current >= pick THEN
        RETURN validator       // selected!
    END IF
END FOR

// Intuition:
// Imagine a number line 0 ──── total_stake
// Each validator occupies a segment proportional to their stake
// A random dart landing in their segment selects them`,
    pythonCode: `import random

def select_validator(validators: dict) -> str:
    """
    Weighted random selection.
    validators: { 'Alice': 50, 'Bob': 30, 'Charlie': 20 }
    """
    total_stake = sum(validators.values())
    pick        = random.uniform(0, total_stake)
    current     = 0

    for validator, stake in validators.items():
        current += stake
        if current >= pick:
            return validator

# ---- Probability simulation ----
validators = {'Alice': 50, 'Bob': 30, 'Charlie': 20}
counts = {'Alice': 0, 'Bob': 0, 'Charlie': 0}

for _ in range(100_000):
    chosen = select_validator(validators)
    counts[chosen] += 1

for name, count in counts.items():
    print(f"{name}: {count/1000:.1f}%")
# Alice:   ~50.0%
# Bob:     ~30.0%
# Charlie: ~20.0%`,
  },
//   {
//     id: 'slashing',
//     title: 'Slashing Mechanism',
//     icon: '⚠️',
//     color: 'red',
//     content: 'Slashing is a penalty mechanism that punishes validators who act maliciously or behave incorrectly. When slashing occurs, a portion of the validator\'s staked tokens is destroyed.',
//     slashingPseudo: `ALGORITHM: Slashing
// ────────────────────────────────────────
// ON RECEIVE evidence(validator, offense_type):

//   IF offense_type == DOUBLE_VOTE:
//       penalty ← validator.stake × (1/32)
//       validator.stake ← validator.stake - penalty
//       BURN(penalty)                      // tokens destroyed
//       emit SlashEvent(validator, penalty)

//   ELSE IF offense_type == SURROUND_VOTE:
//       // Correlated penalty — worse when many validators misbehave
//       slash_fraction ← 3 × (num_slashed_this_epoch / total_validators)
//       slash_fraction ← MIN(1, slash_fraction)
//       penalty        ← validator.stake × slash_fraction
//       validator.stake ← validator.stake - penalty
//       BURN(penalty)

//   ELSE IF offense_type == INACTIVITY:
//       // Inactivity leak — gradual drain until >2/3 are active again
//       leak_rate       ← BASE_REWARD × epochs_since_finality²
//       validator.stake ← validator.stake - leak_rate
//       // NOT burned — redistributed to active validators

//   IF validator.stake < MIN_STAKE:
//       EJECT_VALIDATOR(validator)         // removed from set`,
//     slashingPython: `class Validator:
//     def __init__(self, name, stake):
//         self.name        = name
//         self.stake       = stake
//         self.is_active   = True

// MIN_STAKE          = 16  # tokens required to remain a validator
// total_validators   = 100

// def slash(validator: Validator, offense: str,
//           num_slashed_this_epoch: int = 1) -> float:
//     """Apply slashing penalty and return amount burned."""
//     if offense == 'double_vote':
//         penalty = validator.stake / 32

//     elif offense == 'surround_vote':
//         # Correlated: scales with how many others misbehaved
//         fraction = min(1.0, 3 * num_slashed_this_epoch / total_validators)
//         penalty  = validator.stake * fraction

//     elif offense == 'inactivity':
//         # Soft penalty — not burned, just reduced
//         penalty = validator.stake * 0.01   # simplified

//     else:
//         raise ValueError(f"Unknown offense: {offense}")

//     validator.stake -= penalty
//     print(f"{validator.name} slashed {penalty:.2f} tokens | "
//           f"Remaining: {validator.stake:.2f}")

//     if validator.stake < MIN_STAKE:
//         validator.is_active = False
//         print(f"{validator.name} EJECTED from validator set")

//     return penalty

// # Demo
// v = Validator('Eve (malicious)', 100)
// slash(v, 'double_vote')
// slash(v, 'surround_vote', num_slashed_this_epoch=20)`,
//     scenarios: [
//       {
//         title: 'Double Voting',
//         desc: 'A validator signs two different blocks for the same slot',
//         penalty: 'Loss of 1/32 of staked amount',
//         severity: 'high',
//       },
//       {
//         title: 'Surround Voting',
//         desc: 'A validator creates an attestation that surrounds another',
//         penalty: 'Loss of staked amount proportional to other slashed validators',
//         severity: 'high',
//       },
//       {
//         title: 'Going Offline',
//         desc: 'A validator fails to perform their duties',
//         penalty: 'Gradual reduction of rewards (inactivity leak)',
//         severity: 'medium',
//       },
//     ],
//   },
  {
    id: 'pow-vs-pos',
    title: 'PoW vs PoS Comparison',
    icon: '⚖️',
    color: 'amber',
    comparison: [
      { aspect: 'Energy Usage', pow: 'Very High (mining hardware)', pos: 'Very Low (no mining)', winner: 'pos' },
      { aspect: 'Hardware', pow: 'Expensive GPUs/ASICs', pos: 'Standard computer', winner: 'pos' },
      { aspect: 'Security Model', pow: 'Computational power', pos: 'Economic incentives (stake)', winner: 'tie' },
      { aspect: 'Attack Cost', pow: '51% of hash power', pos: '51% of staked tokens', winner: 'pos' },
      { aspect: 'Decentralization', pow: 'Mining pool concentration', pos: 'Wealth concentration risk', winner: 'tie' },
      { aspect: 'Throughput', pow: '~7 TPS (Bitcoin)', pos: '~100,000 TPS (Solana)', winner: 'pos' },
      { aspect: 'Finality', pow: 'Probabilistic (~60 min)', pos: 'Deterministic (~12 min)', winner: 'pos' },
      { aspect: 'Maturity', pow: 'Battle tested (15+ years)', pos: 'Relatively newer', winner: 'pow' },
    ],
  },
  {
    id: 'real-world',
    title: 'Real-World Implementations',
    icon: '🌐',
    color: 'cyan',
    implementations: [
      {
        name: 'Ethereum 2.0',
        logo: 'Ξ',
        mechanism: 'Casper FFG + LMD-GHOST',
        minStake: '32 ETH (~$100K)',
        validators: '900,000+',
        launched: 'Sep 2022 (The Merge)',
      },
      {
        name: 'Cardano',
        logo: '₳',
        mechanism: 'Ouroboros Praos',
        minStake: '1 ADA',
        validators: '3,000+ pools',
        launched: 'Jul 2020',
      },
      {
        name: 'Solana',
        logo: 'S',
        mechanism: 'Tower BFT + Proof of History',
        minStake: 'No minimum',
        validators: '1,500+',
        launched: 'Mar 2020',
      },
      {
        name: 'Polkadot',
        logo: '●',
        mechanism: 'Nominated PoS (NPoS)',
        minStake: '120 DOT',
        validators: '297 active',
        launched: 'May 2020',
      },
    ],
  },
  {
    id: 'advantages',
    title: 'Advantages & Challenges',
    icon: '📊',
    color: 'green',
    advantages: [
      'Energy efficient — 99.95% less energy than PoW',
      'Lower barrier to entry — no expensive hardware',
      'Better scalability — faster block times',
      'Economic security via slashing penalties',
      'Reduces centralization risk from mining pools',
    ],
    challenges: [
      '"Nothing at Stake" problem — validators can bet on multiple forks',
      'Wealth concentration — rich get richer',
      'Long-range attacks — rewriting history from earlier state',
      'Initial distribution — how tokens are first distributed',
      'Complexity — more complex protocol design than PoW',
    ],
  },
];

export default function PosExplained() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [activeStep, setActiveStep] = useState(0);
  const [copiedId, setCopiedId] = useState(null);

  const currentSection = sections.find(s => s.id === activeSection);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">📘 How Proof of Stake Works</h1>
        <p className="text-slate-500">A comprehensive guide to the PoS consensus mechanism</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4 sticky top-20 space-y-1">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 px-3">Topics</p>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => { setActiveSection(section.id); setActiveStep(0); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center space-x-2 ${
                  activeSection === section.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{section.icon}</span>
                <span className="truncate">{section.title}</span>
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

                {/* Key Points */}
                {currentSection.keyPoints && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                    {currentSection.keyPoints.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start space-x-2 bg-indigo-50 rounded-xl p-3 border border-indigo-100"
                      >
                        <span className="text-indigo-500 mt-0.5 text-lg">❖</span>
                        <span className="text-slate-700 text-sm">{point}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Steps (for how-it-works) */}
              {currentSection.steps && (
                <div className="space-y-4">
                  {/* Step navigator */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {currentSection.steps.map((step, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm transition-all ${
                          activeStep === i
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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

                  {/* Active Step Detail */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="glass-card p-8"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl font-bold">
                          {currentSection.steps[activeStep].num}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {currentSection.steps[activeStep].title}
                        </h3>
                      </div>
                      <p className="text-slate-600 text-lg leading-relaxed mb-4">
                        {currentSection.steps[activeStep].desc}
                      </p>
                      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                        <p className="text-sm text-indigo-700">
                          💡 {currentSection.steps[activeStep].detail}
                        </p>
                      </div>

                      {/* Step Navigation */}
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
                          className="px-4 py-2 rounded-xl text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-30 transition-all border border-indigo-200 hover:border-indigo-400 disabled:hover:border-indigo-200"
                        >
                          Next →
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Step flow diagram */}
                  <div className="glass-card p-6">
                    <h4 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Process Flow</h4>
                    <div className="flex items-center justify-between">
                      {currentSection.steps.map((step, i) => (
                        <div key={i} className="flex items-center">
                          <motion.div
                            className={`flex flex-col items-center ${
                              i <= activeStep ? 'opacity-100' : 'opacity-30'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                              i === activeStep
                                ? 'bg-emerald-500 text-white shadow-md'
                                : i < activeStep
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-200 text-slate-400'
                            }`}>
                              {i < activeStep ? '✓' : step.num}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 text-center max-w-[60px]">{step.title}</p>
                          </motion.div>
                          {i < currentSection.steps.length - 1 && (
                            <div className={`w-8 h-0.5 mx-1 transition-all ${
                              i < activeStep ? 'bg-emerald-500' : 'bg-slate-200'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Algorithm code blocks */}
              {currentSection.formula && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-400 uppercase mb-1">Selection Formula</p>
                  <p className="text-2xl font-mono text-purple-700">{currentSection.formula}</p>
                </div>
              )}
              {currentSection.pseudocode && (
                <CodeBlock
                  title="Pseudocode Algorithm"
                  code={currentSection.pseudocode}
                  id="pseudocode"
                  lang="pseudocode"
                  color="purple"
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
              {currentSection.slashingPseudo && (
                <CodeBlock
                  title="Slashing Algorithm (Pseudocode)"
                  code={currentSection.slashingPseudo}
                  id="slashingPseudo"
                  lang="pseudocode"
                  color="red"
                  copiedId={copiedId}
                  onCopy={copyCode}
                />
              )}
              {currentSection.slashingPython && (
                <CodeBlock
                  title="Python Implementation"
                  code={currentSection.slashingPython}
                  id="slashingPython"
                  lang="python"
                  color="green"
                  copiedId={copiedId}
                  onCopy={copyCode}
                />
              )}

              {/* Slashing Scenarios */}
              {currentSection.scenarios && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentSection.scenarios.map((scenario, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`glass-card p-5 border-t-2 ${
                        scenario.severity === 'high' ? 'border-t-red-500' : 'border-t-yellow-500'
                      }`}
                    >
                      <h4 className="font-bold text-slate-900 mb-2">{scenario.title}</h4>
                      <p className="text-sm text-slate-500 mb-3">{scenario.desc}</p>
                      <div className={`text-xs font-medium px-3 py-1.5 rounded-lg inline-block ${
                        scenario.severity === 'high'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        Penalty: {scenario.penalty}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Comparison Table */}
              {currentSection.comparison && (
                <div className="glass-card overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left p-4 text-sm text-slate-500">Aspect</th>
                        <th className="text-left p-4 text-sm text-amber-700">⛏️ Proof of Work</th>
                        <th className="text-left p-4 text-sm text-indigo-700">⚡ Proof of Stake</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSection.comparison.map((row, i) => (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-slate-200"
                        >
                          <td className="p-4 text-sm font-medium text-slate-800">{row.aspect}</td>
                          <td className={`p-4 text-sm ${row.winner === 'pow' ? 'text-amber-700 font-semibold' : 'text-slate-500'}`}>
                            {row.winner === 'pow' && '🏆 '}{row.pow}
                          </td>
                          <td className={`p-4 text-sm ${row.winner === 'pos' ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                            {row.winner === 'pos' && '🏆 '}{row.pos}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
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
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                          {impl.logo}
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{impl.name}</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Mechanism</span>
                          <span className="text-indigo-700">{impl.mechanism}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Min Stake</span>
                          <span className="text-slate-800">{impl.minStake}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Validators</span>
                          <span className="text-emerald-700">{impl.validators}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Launched</span>
                          <span className="text-slate-600">{impl.launched}</span>
                        </div>
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
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start space-x-2 text-sm text-slate-600"
                        >
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
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start space-x-2 text-sm text-slate-600"
                        >
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

'use client'

import { useState } from 'react'

// Color palette matching website theme
const colors = {
  gold: '#D4AF37',
  lightGold: '#F5D76E',
  deepGold: '#AA8420',
  white: '#fafafa',
  muted: '#a1a1aa',
  dark: '#27272a',
  obsidian: '#09090b',
  card: '#0c0c0e',
}

// Neural Network Diagram - Interactive visualization
export function NeuralNetworkDiagram() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null)
  
  const layers = [
    { name: 'Input Layer', neurons: 4, color: colors.muted, description: 'Receives raw data (features)' },
    { name: 'Hidden Layer 1', neurons: 6, color: colors.deepGold, description: 'Extracts low-level patterns' },
    { name: 'Hidden Layer 2', neurons: 6, color: colors.gold, description: 'Combines patterns into features' },
    { name: 'Output Layer', neurons: 2, color: colors.lightGold, description: 'Makes final prediction' },
  ]

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 rounded-2xl border border-brand-gold/20 overflow-hidden">
      <h4 className="text-xl font-display font-bold text-white mb-2 text-center">Neural Network Architecture</h4>
      <p className="text-gray-400 text-sm text-center mb-6">Click on layers to learn more</p>
      
      <div className="relative">
        <svg viewBox="0 0 500 300" className="w-full max-w-2xl mx-auto">
          {/* Connection lines */}
          {layers.slice(0, -1).map((layer, li) => {
            const x1 = 60 + li * 130
            const x2 = 60 + (li + 1) * 130
            const nextLayer = layers[li + 1]
            
            return layer.neurons > 0 && nextLayer.neurons > 0 ? (
              <g key={`connections-${li}`} className="opacity-20">
                {Array.from({ length: layer.neurons }).map((_, ni) => {
                  const y1 = 150 - ((layer.neurons - 1) * 25) / 2 + ni * 25
                  return Array.from({ length: nextLayer.neurons }).map((_, nj) => {
                    const y2 = 150 - ((nextLayer.neurons - 1) * 25) / 2 + nj * 25
                    return (
                      <line
                        key={`${li}-${ni}-${nj}`}
                        x1={x1 + 12}
                        y1={y1}
                        x2={x2 - 12}
                        y2={y2}
                        stroke={activeLayer === li || activeLayer === li + 1 ? colors.gold : colors.muted}
                        strokeWidth="1"
                        className="transition-all duration-300"
                      />
                    )
                  })
                })}
              </g>
            ) : null
          })}
          
          {/* Neurons */}
          {layers.map((layer, li) => {
            const x = 60 + li * 130
            return (
              <g
                key={`layer-${li}`}
                onClick={() => setActiveLayer(activeLayer === li ? null : li)}
                className="cursor-pointer"
              >
                {Array.from({ length: layer.neurons }).map((_, ni) => {
                  const y = 150 - ((layer.neurons - 1) * 25) / 2 + ni * 25
                  return (
                    <g key={`neuron-${li}-${ni}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill={activeLayer === li ? layer.color : `${layer.color}40`}
                        stroke={layer.color}
                        strokeWidth="2"
                        className="transition-all duration-300 hover:scale-110"
                        style={{ transformOrigin: `${x}px ${y}px` }}
                      />
                      {activeLayer === li && (
                        <circle
                          cx={x}
                          cy={y}
                          r="16"
                          fill="none"
                          stroke={layer.color}
                          strokeWidth="1"
                          className="animate-ping"
                          style={{ animationDuration: '1.5s' }}
                        />
                      )}
                    </g>
                  )
                })}
                {/* Layer label */}
                <text
                  x={x}
                  y={270}
                  textAnchor="middle"
                  fill={activeLayer === li ? colors.white : colors.muted}
                  fontSize="11"
                  fontWeight="500"
                  className="transition-colors duration-300"
                >
                  {layer.name}
                </text>
              </g>
            )
          })}
          
          {/* Data flow arrows */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={colors.gold} />
            </marker>
          </defs>
          <line x1="10" y1="150" x2="35" y2="150" stroke={colors.gold} strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="465" y1="150" x2="490" y2="150" stroke={colors.gold} strokeWidth="2" markerEnd="url(#arrowhead)" />
          <text x="5" y="170" fill={colors.gold} fontSize="10">Data</text>
          <text x="470" y="170" fill={colors.gold} fontSize="10">Output</text>
        </svg>
      </div>
      
      {/* Info panel */}
      {activeLayer !== null && (
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-brand-gold/20 animate-fadeIn">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layers[activeLayer].color }} />
            <h5 className="font-semibold text-white">{layers[activeLayer].name}</h5>
          </div>
          <p className="text-gray-400 text-sm">{layers[activeLayer].description}</p>
          <p className="text-gray-500 text-xs mt-2">{layers[activeLayer].neurons} neurons</p>
        </div>
      )}
    </div>
  )
}

// Machine Learning Types Diagram
export function MLTypesDiagram() {
  const [activeType, setActiveType] = useState<string | null>(null)
  
  const types = [
    {
      id: 'supervised',
      name: 'Supervised Learning',
      icon: '🎯',
      color: colors.lightGold,
      description: 'Learn from labeled examples',
      examples: ['Classification', 'Regression', 'Object Detection'],
      analogy: 'Like learning with a teacher who provides correct answers'
    },
    {
      id: 'unsupervised',
      name: 'Unsupervised Learning',
      icon: '🔍',
      color: colors.gold,
      description: 'Find patterns in unlabeled data',
      examples: ['Clustering', 'Dimensionality Reduction', 'Anomaly Detection'],
      analogy: 'Like organizing a messy room without instructions'
    },
    {
      id: 'reinforcement',
      name: 'Reinforcement Learning',
      icon: '🎮',
      color: colors.deepGold,
      description: 'Learn through trial and error',
      examples: ['Game Playing', 'Robotics', 'Autonomous Vehicles'],
      analogy: 'Like training a pet with rewards and feedback'
    },
  ]

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 rounded-2xl border border-brand-gold/20">
      <h4 className="text-xl font-display font-bold text-white mb-6 text-center">Types of Machine Learning</h4>
      
      <div className="grid md:grid-cols-3 gap-4">
        {types.map((type) => (
          <div
            key={type.id}
            onClick={() => setActiveType(activeType === type.id ? null : type.id)}
            className={`
              p-5 rounded-xl border cursor-pointer transition-all duration-300
              ${activeType === type.id 
                ? 'bg-brand-gold/10 border-brand-gold/50 scale-[1.02]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-brand-gold/30 hover:scale-[1.01]'
              }
            `}
          >
            <div className="text-4xl mb-3">{type.icon}</div>
            <h5 
              className="font-semibold mb-2 transition-colors"
              style={{ color: activeType === type.id ? type.color : colors.white }}
            >
              {type.name}
            </h5>
            <p className="text-gray-400 text-sm mb-3">{type.description}</p>
            
            {activeType === type.id && (
              <div className="space-y-3 animate-fadeIn">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Examples</p>
                  <div className="flex flex-wrap gap-1">
                    {type.examples.map((ex, i) => (
                      <span key={i} className="px-2 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded text-xs text-gray-300">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Analogy</p>
                  <p className="text-sm text-gray-300 italic">{type.analogy}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// AI Timeline Diagram
export function AITimelineDiagram() {
  const milestones = [
    { year: '1950', event: 'Turing Test', description: 'Alan Turing proposes test for machine intelligence', color: colors.muted },
    { year: '1956', event: 'AI Coined', description: 'Dartmouth Conference: "Artificial Intelligence" term created', color: colors.deepGold },
    { year: '1997', event: 'Deep Blue', description: 'IBM\'s Deep Blue defeats chess champion Kasparov', color: colors.gold },
    { year: '2012', event: 'Deep Learning', description: 'AlexNet wins ImageNet, sparking deep learning revolution', color: colors.lightGold },
    { year: '2017', event: 'Transformers', description: '"Attention Is All You Need" paper revolutionizes NLP', color: colors.gold },
    { year: '2022', event: 'ChatGPT', description: 'Large Language Models reach mainstream adoption', color: colors.lightGold },
  ]

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 rounded-2xl border border-brand-gold/20 overflow-x-auto">
      <h4 className="text-xl font-display font-bold text-white mb-6 text-center">AI History Timeline</h4>
      
      <div className="relative min-w-[600px]">
        {/* Timeline line */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-zinc-700 via-brand-gold to-brand-gold/50 rounded-full" />
        
        {/* Milestones */}
        <div className="flex justify-between relative">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex flex-col items-center group" style={{ width: `${100 / milestones.length}%` }}>
              {/* Dot */}
              <div
                className="w-4 h-4 rounded-full border-4 border-[#09090b] z-10 transition-transform group-hover:scale-150"
                style={{ backgroundColor: milestone.color }}
              />
              
              {/* Year */}
              <div className="mt-4 text-lg font-bold" style={{ color: milestone.color }}>
                {milestone.year}
              </div>
              
              {/* Event */}
              <div className="mt-2 text-center px-2">
                <h6 className="text-white font-medium text-sm">{milestone.event}</h6>
                <p className="text-gray-500 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Backpropagation Diagram
export function BackpropDiagram() {
  const [step, setStep] = useState(0)
  
  const steps = [
    { title: 'Forward Pass', description: 'Input flows through network, making predictions', color: colors.muted },
    { title: 'Calculate Loss', description: 'Compare prediction with actual value', color: '#ef4444' },
    { title: 'Backward Pass', description: 'Compute gradients using chain rule', color: colors.gold },
    { title: 'Update Weights', description: 'Adjust weights to reduce error', color: colors.lightGold },
  ]

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 rounded-2xl border border-brand-gold/20">
      <h4 className="text-xl font-display font-bold text-white mb-2 text-center">Backpropagation Process</h4>
      <p className="text-gray-400 text-sm text-center mb-6">How neural networks learn from mistakes</p>
      
      {/* Steps */}
      <div className="flex justify-between mb-6 relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10" />
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`
              relative z-10 flex flex-col items-center transition-all
              ${step === i ? 'scale-110' : 'opacity-60 hover:opacity-100'}
            `}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= i ? 'text-black' : 'text-gray-500'
              }`}
              style={{ backgroundColor: step >= i ? s.color : colors.dark }}
            >
              {i + 1}
            </div>
            <span className="text-xs text-gray-400 mt-2 text-center max-w-[80px]">{s.title}</span>
          </button>
        ))}
      </div>
      
      {/* Animation area */}
      <div className="relative h-48 bg-black/30 rounded-xl overflow-hidden border border-white/5">
        <svg viewBox="0 0 400 150" className="w-full h-full">
          {/* Network visualization */}
          {[0, 1, 2].map((layer) => (
            <g key={layer}>
              {[0, 1, 2].map((neuron) => (
                <circle
                  key={`${layer}-${neuron}`}
                  cx={80 + layer * 120}
                  cy={40 + neuron * 35}
                  r="15"
                  fill={step === 0 ? colors.muted : step === 2 ? colors.gold : colors.dark}
                  stroke={steps[step].color}
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
              ))}
            </g>
          ))}
          
          {/* Arrows based on step */}
          {step === 0 && (
            <g className="animate-pulse">
              <line x1="40" y1="75" x2="60" y2="75" stroke={colors.muted} strokeWidth="3" markerEnd="url(#arrow)" />
              <line x1="100" y1="75" x2="180" y2="75" stroke={colors.muted} strokeWidth="3" markerEnd="url(#arrow)" />
              <line x1="220" y1="75" x2="300" y2="75" stroke={colors.muted} strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="350" y="80" fill={colors.muted} fontSize="12">ŷ</text>
            </g>
          )}
          
          {step === 1 && (
            <g>
              <text x="340" y="50" fill="#ef4444" fontSize="14" fontWeight="bold">Loss</text>
              <text x="330" y="75" fill="#ef4444" fontSize="20">⚡</text>
              <text x="320" y="100" fill="#ef4444" fontSize="10">(y - ŷ)²</text>
            </g>
          )}
          
          {step === 2 && (
            <g className="animate-pulse">
              <line x1="300" y1="75" x2="220" y2="75" stroke={colors.gold} strokeWidth="3" markerEnd="url(#arrow)" />
              <line x1="180" y1="75" x2="100" y2="75" stroke={colors.gold} strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="15" y="80" fill={colors.gold} fontSize="10">∂L/∂w</text>
            </g>
          )}
          
          {step === 3 && (
            <g>
              <text x="140" y="130" fill={colors.lightGold} fontSize="12">w = w - α × ∂L/∂w</text>
              <circle cx="80" cy="75" r="18" fill="none" stroke={colors.lightGold} strokeWidth="2" className="animate-ping" />
              <circle cx="200" cy="75" r="18" fill="none" stroke={colors.lightGold} strokeWidth="2" className="animate-ping" style={{ animationDelay: '0.2s' }} />
              <circle cx="320" cy="75" r="18" fill="none" stroke={colors.lightGold} strokeWidth="2" className="animate-ping" style={{ animationDelay: '0.4s' }} />
            </g>
          )}
          
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill={steps[step].color} />
            </marker>
          </defs>
        </svg>
      </div>
      
      {/* Description */}
      <div className="mt-4 p-4 rounded-lg border border-white/10" style={{ backgroundColor: `${steps[step].color}15` }}>
        <p className="text-gray-300 text-sm">{steps[step].description}</p>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-3 py-1 bg-white/10 rounded text-sm text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={() => setStep(Math.min(3, step + 1))}
          disabled={step === 3}
          className="px-3 py-1 bg-white/10 rounded text-sm text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

// CNN Diagram
export function CNNDiagram() {
  return (
    <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 rounded-2xl border border-brand-gold/20 overflow-x-auto">
      <h4 className="text-xl font-display font-bold text-white mb-2 text-center">Convolutional Neural Network</h4>
      <p className="text-gray-400 text-sm text-center mb-6">How CNNs process images layer by layer</p>
      
      <div className="min-w-[700px]">
        <svg viewBox="0 0 700 200" className="w-full">
          {/* Input Image */}
          <g>
            <rect x="20" y="50" width="80" height="80" fill="none" stroke={colors.muted} strokeWidth="2" rx="4" />
            <text x="60" y="150" textAnchor="middle" fill={colors.muted} fontSize="11">Input Image</text>
            {/* Grid pattern */}
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={25 + col * 18}
                  y={55 + row * 18}
                  width="16"
                  height="16"
                  fill={`rgba(161, 161, 170, ${0.2 + Math.random() * 0.4})`}
                  rx="2"
                />
              ))
            )}
          </g>
          
          {/* Arrow */}
          <path d="M110 90 L140 90" stroke={colors.dark} strokeWidth="2" markerEnd="url(#cnnArrow)" />
          
          {/* Conv Layer 1 */}
          <g>
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x={150 + i * 8}
                y={40 + i * 8}
                width="70"
                height="70"
                fill={`${colors.deepGold}${30 + i * 20}`}
                stroke={colors.deepGold}
                strokeWidth="1"
                rx="4"
              />
            ))}
            <text x="185" y="150" textAnchor="middle" fill={colors.deepGold} fontSize="11">Conv + ReLU</text>
          </g>
          
          {/* Arrow */}
          <path d="M240 90 L270 90" stroke={colors.dark} strokeWidth="2" markerEnd="url(#cnnArrow)" />
          
          {/* Pooling */}
          <g>
            <rect x="280" y="55" width="50" height="50" fill={`${colors.muted}30`} stroke={colors.muted} strokeWidth="2" rx="4" />
            <text x="305" y="150" textAnchor="middle" fill={colors.muted} fontSize="11">Max Pool</text>
          </g>
          
          {/* Arrow */}
          <path d="M340 90 L370 90" stroke={colors.dark} strokeWidth="2" markerEnd="url(#cnnArrow)" />
          
          {/* Conv Layer 2 */}
          <g>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={380 + i * 6}
                y={50 + i * 6}
                width="45"
                height="45"
                fill={`${colors.gold}${30 + i * 15}`}
                stroke={colors.gold}
                strokeWidth="1"
                rx="4"
              />
            ))}
            <text x="410" y="150" textAnchor="middle" fill={colors.gold} fontSize="11">Conv + ReLU</text>
          </g>
          
          {/* Arrow */}
          <path d="M450 90 L480 90" stroke={colors.dark} strokeWidth="2" markerEnd="url(#cnnArrow)" />
          
          {/* Flatten */}
          <g>
            <rect x="490" y="40" width="20" height="100" fill={`${colors.lightGold}30`} stroke={colors.lightGold} strokeWidth="2" rx="4" />
            <text x="500" y="160" textAnchor="middle" fill={colors.lightGold} fontSize="11">Flatten</text>
          </g>
          
          {/* Arrow */}
          <path d="M520 90 L550 90" stroke={colors.dark} strokeWidth="2" markerEnd="url(#cnnArrow)" />
          
          {/* FC Layers */}
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx="570" cy={45 + i * 22} r="8" fill={colors.gold} />
            ))}
            {[0, 1, 2].map((i) => (
              <circle key={i} cx="620" cy={60 + i * 30} r="8" fill={colors.lightGold} />
            ))}
            <text x="595" y="160" textAnchor="middle" fill={colors.gold} fontSize="11">Fully Connected</text>
          </g>
          
          {/* Arrow */}
          <path d="M640 90 L670 90" stroke={colors.dark} strokeWidth="2" markerEnd="url(#cnnArrow)" />
          
          {/* Output */}
          <text x="680" y="85" fill={colors.lightGold} fontSize="14" fontWeight="bold">🐱</text>
          <text x="680" y="105" fill={colors.muted} fontSize="14" fontWeight="bold">🐶</text>
          
          <defs>
            <marker id="cnnArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill={colors.dark} />
            </marker>
          </defs>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.muted }} />
          <span className="text-gray-400">Input / Pooling</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.deepGold }} />
          <span className="text-gray-400">Convolution</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.gold }} />
          <span className="text-gray-400">Dense Layers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.lightGold }} />
          <span className="text-gray-400">Output</span>
        </div>
      </div>
    </div>
  )
}

// Transformer Architecture Diagram
export function TransformerDiagram() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null)
  
  const components = {
    'input': { name: 'Input Embedding', description: 'Converts tokens to vectors and adds positional information', color: colors.muted },
    'attention': { name: 'Multi-Head Attention', description: 'Allows model to focus on different parts of input simultaneously', color: colors.gold },
    'ffn': { name: 'Feed-Forward Network', description: 'Processes attended information through dense layers', color: colors.deepGold },
    'output': { name: 'Output', description: 'Generates probability distribution over vocabulary', color: colors.lightGold },
  }

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 rounded-2xl border border-brand-gold/20">
      <h4 className="text-xl font-display font-bold text-white mb-2 text-center">Transformer Architecture</h4>
      <p className="text-gray-400 text-sm text-center mb-6">The foundation of modern LLMs like GPT and BERT</p>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <svg viewBox="0 0 300 400" className="w-full max-w-xs mx-auto">
            {/* Input */}
            <g
              onClick={() => setActiveComponent('input')}
              className="cursor-pointer"
            >
              <rect
                x="75"
                y="340"
                width="150"
                height="40"
                fill={activeComponent === 'input' ? colors.muted : `${colors.muted}40`}
                stroke={colors.muted}
                strokeWidth="2"
                rx="8"
                className="transition-all hover:scale-105"
                style={{ transformOrigin: '150px 360px' }}
              />
              <text x="150" y="365" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">Input Embedding</text>
            </g>
            
            {/* Positional encoding */}
            <circle cx="250" cy="360" r="15" fill={`${colors.muted}40`} stroke={colors.muted} strokeWidth="2" />
            <text x="250" y="365" textAnchor="middle" fill={colors.muted} fontSize="16">+</text>
            <text x="250" y="390" textAnchor="middle" fill={colors.muted} fontSize="8">Position</text>
            
            {/* Arrow up */}
            <path d="M150 340 L150 300" stroke={colors.dark} strokeWidth="2" markerEnd="url(#tfArrow)" />
            
            {/* Transformer block */}
            <rect x="50" y="100" width="200" height="200" fill="none" stroke={colors.gold} strokeWidth="2" strokeDasharray="5,5" rx="12" />
            <text x="150" y="90" textAnchor="middle" fill={colors.gold} fontSize="10">Transformer Block (×N)</text>
            
            {/* Multi-head attention */}
            <g
              onClick={() => setActiveComponent('attention')}
              className="cursor-pointer"
            >
              <rect
                x="75"
                y="220"
                width="150"
                height="60"
                fill={activeComponent === 'attention' ? colors.gold : `${colors.gold}40`}
                stroke={colors.gold}
                strokeWidth="2"
                rx="8"
                className="transition-all hover:scale-105"
                style={{ transformOrigin: '150px 250px' }}
              />
              <text x="150" y="245" textAnchor="middle" fill={activeComponent === 'attention' ? colors.obsidian : 'white'} fontSize="11" fontWeight="500">Multi-Head</text>
              <text x="150" y="260" textAnchor="middle" fill={activeComponent === 'attention' ? colors.obsidian : 'white'} fontSize="11" fontWeight="500">Attention</text>
            </g>
            
            {/* Add & Norm */}
            <rect x="100" y="190" width="100" height="20" fill={`${colors.lightGold}20`} stroke={colors.lightGold} strokeWidth="1" rx="4" />
            <text x="150" y="204" textAnchor="middle" fill={colors.lightGold} fontSize="9">Add & Norm</text>
            
            {/* Arrow */}
            <path d="M150 190 L150 160" stroke={colors.dark} strokeWidth="2" markerEnd="url(#tfArrow)" />
            
            {/* Feed Forward */}
            <g
              onClick={() => setActiveComponent('ffn')}
              className="cursor-pointer"
            >
              <rect
                x="75"
                y="110"
                width="150"
                height="40"
                fill={activeComponent === 'ffn' ? colors.deepGold : `${colors.deepGold}40`}
                stroke={colors.deepGold}
                strokeWidth="2"
                rx="8"
                className="transition-all hover:scale-105"
                style={{ transformOrigin: '150px 130px' }}
              />
              <text x="150" y="135" textAnchor="middle" fill={activeComponent === 'ffn' ? colors.obsidian : 'white'} fontSize="11" fontWeight="500">Feed Forward</text>
            </g>
            
            {/* Arrow up */}
            <path d="M150 100 L150 60" stroke={colors.dark} strokeWidth="2" markerEnd="url(#tfArrow)" />
            
            {/* Output */}
            <g
              onClick={() => setActiveComponent('output')}
              className="cursor-pointer"
            >
              <rect
                x="75"
                y="20"
                width="150"
                height="40"
                fill={activeComponent === 'output' ? colors.lightGold : `${colors.lightGold}40`}
                stroke={colors.lightGold}
                strokeWidth="2"
                rx="8"
                className="transition-all hover:scale-105"
                style={{ transformOrigin: '150px 40px' }}
              />
              <text x="150" y="45" textAnchor="middle" fill={activeComponent === 'output' ? colors.obsidian : 'white'} fontSize="12" fontWeight="500">Output</text>
            </g>
            
            {/* Skip connections */}
            <path d="M55 280 L55 220 L75 220" stroke={colors.gold} strokeWidth="1" strokeDasharray="3,3" fill="none" />
            <path d="M55 160 L55 130 L75 130" stroke={colors.deepGold} strokeWidth="1" strokeDasharray="3,3" fill="none" />
            
            <defs>
              <marker id="tfArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill={colors.dark} />
              </marker>
            </defs>
          </svg>
        </div>
        
        {/* Info panel */}
        <div className="lg:w-64">
          {activeComponent ? (
            <div className="p-4 bg-white/5 rounded-xl border border-brand-gold/20 animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: components[activeComponent as keyof typeof components].color }} />
                <h5 className="font-semibold text-white">
                  {components[activeComponent as keyof typeof components].name}
                </h5>
              </div>
              <p className="text-gray-400 text-sm">
                {components[activeComponent as keyof typeof components].description}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-gray-500 text-sm">Click on a component to learn more</p>
            </div>
          )}
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.muted }} />
              <span>Embedding Layer</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.gold }} />
              <span>Attention Mechanism</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.deepGold }} />
              <span>Feed-Forward Network</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.lightGold }} />
              <span>Output / Normalization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

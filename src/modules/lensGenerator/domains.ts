/**
 * Domain library for creative lens generation
 * Contains 50+ domains from diverse fields of knowledge
 */

import { DomainLibrary, DomainCategory } from './types';

export const DOMAIN_LIBRARY: DomainLibrary = {
  // NATURAL SYSTEMS
  'quantum_physics': {
    name: 'Quantum Physics',
    category: DomainCategory.SCIENCES,
    metaphors: ['superposition', 'quantum entanglement', 'observer effect'],
    questions: [
      'What if the problem exists in multiple states simultaneously?',
      'How does observing the problem change its nature?',
      'Where are the quantum tunnels in this situation?'
    ],
    principles: ['uncertainty', 'probability', 'wave function collapse'],
    expertRole: 'quantum physicist',
    perspective: 'probabilistic reality where observation creates outcomes'
  },
  
  'ecosystem': {
    name: 'Ecosystem',
    category: DomainCategory.NATURAL_SYSTEMS,
    metaphors: ['food web', 'symbiosis', 'ecological niche'],
    questions: [
      'What are the predator-prey relationships here?',
      'How does energy flow through this system?',
      'Which species is the keystone?'
    ],
    principles: ['biodiversity', 'nutrient cycles', 'succession'],
    expertRole: 'ecologist',
    perspective: 'interconnected web of dependencies and energy flows'
  },
  
  'evolution': {
    name: 'Evolution',
    category: DomainCategory.NATURAL_SYSTEMS,
    metaphors: ['natural selection', 'adaptation', 'mutation'],
    questions: [
      'What traits would survive in this environment?',
      'How would this problem evolve over generations?',
      'What are the selection pressures?'
    ],
    principles: ['survival of the fittest', 'genetic drift', 'speciation'],
    expertRole: 'evolutionary biologist',
    perspective: 'continuous adaptation through variation and selection'
  },
  
  'weather_systems': {
    name: 'Weather Systems',
    category: DomainCategory.NATURAL_SYSTEMS,
    metaphors: ['pressure systems', 'storm fronts', 'climate patterns'],
    questions: [
      'Where are the high and low pressure zones?',
      'What creates turbulence in this system?',
      'How do small changes cascade into storms?'
    ],
    principles: ['chaos theory', 'thermodynamics', 'fluid dynamics'],
    expertRole: 'meteorologist',
    perspective: 'dynamic systems influenced by invisible forces'
  },
  
  'coral_reef': {
    name: 'Coral Reef',
    category: DomainCategory.NATURAL_SYSTEMS,
    metaphors: ['symbiotic relationships', 'biodiversity hotspot', 'fragile balance'],
    questions: [
      'What provides the structural foundation here?',
      'Which relationships are mutually beneficial?',
      'How does the system respond to bleaching events?'
    ],
    principles: ['mutualism', 'calcium carbonate building', 'photosynthesis'],
    expertRole: 'marine biologist',
    perspective: 'delicate collaborative structures supporting diverse life'
  },
  
  // ARTS
  'jazz_improvisation': {
    name: 'Jazz Improvisation',
    category: DomainCategory.ARTS,
    metaphors: ['rhythm', 'harmony', 'spontaneity'],
    questions: [
      'What rhythm does this problem have?',
      'Where can we improvise here?',
      'How do we create call and response?'
    ],
    principles: ['call and response', 'syncopation', 'modulation'],
    expertRole: 'jazz musician',
    perspective: 'structured freedom within harmonic constraints'
  },
  
  'abstract_painting': {
    name: 'Abstract Painting',
    category: DomainCategory.ARTS,
    metaphors: ['color fields', 'negative space', 'gestural marks'],
    questions: [
      'What emotions does this color palette evoke?',
      'Where is the visual tension?',
      'How does the negative space speak?'
    ],
    principles: ['composition', 'color theory', 'expressionism'],
    expertRole: 'abstract artist',
    perspective: 'non-literal representation of essence and emotion'
  },
  
  'ballet': {
    name: 'Ballet',
    category: DomainCategory.ARTS,
    metaphors: ['graceful movement', 'precise positioning', 'narrative through motion'],
    questions: [
      'What story does this movement tell?',
      'Where is the balance point?',
      'How do we create flow from position to position?'
    ],
    principles: ['turnout', 'elevation', 'line'],
    expertRole: 'ballet choreographer',
    perspective: 'disciplined grace expressing story through movement'
  },
  
  'sculpture': {
    name: 'Sculpture',
    category: DomainCategory.ARTS,
    metaphors: ['negative space', 'form and void', 'material resistance'],
    questions: [
      'What needs to be removed to reveal the form?',
      'How does the material guide the creation?',
      'Where does light create shadow and depth?'
    ],
    principles: ['subtractive process', 'spatial relationships', 'texture'],
    expertRole: 'sculptor',
    perspective: 'revealing hidden forms by removing the unnecessary'
  },
  
  'poetry': {
    name: 'Poetry',
    category: DomainCategory.ARTS,
    metaphors: ['metaphorical layers', 'rhythmic patterns', 'compressed meaning'],
    questions: [
      'What is left unsaid between the lines?',
      'How can we compress this into its essence?',
      'Where do sound and meaning intersect?'
    ],
    principles: ['meter', 'imagery', 'symbolism'],
    expertRole: 'poet',
    perspective: 'maximum meaning in minimum words'
  },
  
  // CULINARY
  'molecular_gastronomy': {
    name: 'Molecular Gastronomy',
    category: DomainCategory.CULINARY,
    metaphors: ['transformation', 'deconstruction', 'unexpected textures'],
    questions: [
      'How can we transform the expected form?',
      'What happens at the molecular level?',
      'Where can we surprise the senses?'
    ],
    principles: ['spherification', 'gelification', 'emulsification'],
    expertRole: 'molecular chef',
    perspective: 'scientific transformation of familiar into extraordinary'
  },
  
  'fermentation': {
    name: 'Fermentation',
    category: DomainCategory.CULINARY,
    metaphors: ['controlled decay', 'beneficial bacteria', 'time transformation'],
    questions: [
      'What needs to break down for new flavors to emerge?',
      'How does time change the nature of things?',
      'Which microorganisms could be allies?'
    ],
    principles: ['anaerobic process', 'pH balance', 'culture development'],
    expertRole: 'fermentation specialist',
    perspective: 'transformation through controlled decomposition'
  },
  
  'wine_tasting': {
    name: 'Wine Tasting',
    category: DomainCategory.CULINARY,
    metaphors: ['terroir', 'complexity layers', 'aging process'],
    questions: [
      'What notes emerge over time?',
      'How does the environment shape the outcome?',
      'What subtle flavors hide beneath the obvious?'
    ],
    principles: ['tannins', 'acidity balance', 'aromatic compounds'],
    expertRole: 'sommelier',
    perspective: 'detecting subtle nuances and environmental influences'
  },
  
  'bread_making': {
    name: 'Bread Making',
    category: DomainCategory.CULINARY,
    metaphors: ['rising dough', 'kneading process', 'proving time'],
    questions: [
      'What needs time to rise?',
      'How does pressure create structure?',
      'When is the proving complete?'
    ],
    principles: ['gluten development', 'yeast activity', 'hydration'],
    expertRole: 'master baker',
    perspective: 'patient development of structure through time and technique'
  },
  
  // SPORTS & GAMES
  'chess': {
    name: 'Chess',
    category: DomainCategory.SPORTS_GAMES,
    metaphors: ['strategic positioning', 'sacrifice for advantage', 'endgame'],
    questions: [
      'What pieces can we sacrifice for position?',
      'How many moves ahead should we think?',
      'Where is the opponent\'s weakness?'
    ],
    principles: ['control the center', 'piece development', 'king safety'],
    expertRole: 'chess grandmaster',
    perspective: 'long-term strategic thinking with tactical execution'
  },
  
  'rock_climbing': {
    name: 'Rock Climbing',
    category: DomainCategory.SPORTS_GAMES,
    metaphors: ['finding holds', 'route reading', 'dynamic movement'],
    questions: [
      'What\'s the next handhold?',
      'How do we distribute weight?',
      'Where\'s the crux of this problem?'
    ],
    principles: ['three-point contact', 'center of gravity', 'momentum'],
    expertRole: 'climbing guide',
    perspective: 'progressive problem-solving through physical and mental challenge'
  },
  
  'surfing': {
    name: 'Surfing',
    category: DomainCategory.SPORTS_GAMES,
    metaphors: ['riding waves', 'reading patterns', 'perfect timing'],
    questions: [
      'When is the perfect moment to catch this wave?',
      'How do we maintain balance in chaos?',
      'Where will the wave break?'
    ],
    principles: ['wave dynamics', 'balance', 'flow state'],
    expertRole: 'surf instructor',
    perspective: 'harmonizing with natural forces through timing and balance'
  },
  
  'poker': {
    name: 'Poker',
    category: DomainCategory.SPORTS_GAMES,
    metaphors: ['bluffing', 'reading tells', 'pot odds'],
    questions: [
      'What information are we hiding?',
      'How do we read the other players?',
      'When should we go all-in?'
    ],
    principles: ['probability', 'psychology', 'risk management'],
    expertRole: 'professional poker player',
    perspective: 'incomplete information decision-making with psychological elements'
  },
  
  // ARCHITECTURE & DESIGN
  'gothic_cathedral': {
    name: 'Gothic Cathedral',
    category: DomainCategory.ARCHITECTURE_DESIGN,
    metaphors: ['flying buttresses', 'rose windows', 'vertical aspiration'],
    questions: [
      'How do we direct forces upward?',
      'Where does light create transcendence?',
      'What external supports enable height?'
    ],
    principles: ['load distribution', 'pointed arches', 'ribbed vaults'],
    expertRole: 'cathedral architect',
    perspective: 'engineering beauty that lifts spirits skyward'
  },
  
  'japanese_garden': {
    name: 'Japanese Garden',
    category: DomainCategory.ARCHITECTURE_DESIGN,
    metaphors: ['borrowed scenery', 'asymmetrical balance', 'seasonal change'],
    questions: [
      'How can we frame the distant view?',
      'Where should we place emptiness?',
      'What changes with the seasons?'
    ],
    principles: ['wabi-sabi', 'ma (negative space)', 'shakkei'],
    expertRole: 'garden designer',
    perspective: 'creating contemplative harmony between nature and design'
  },
  
  'bauhaus': {
    name: 'Bauhaus Design',
    category: DomainCategory.ARCHITECTURE_DESIGN,
    metaphors: ['form follows function', 'geometric purity', 'industrial materials'],
    questions: [
      'What is the essential function?',
      'How can we eliminate decoration?',
      'Where do materials express themselves?'
    ],
    principles: ['minimalism', 'functionality', 'mass production'],
    expertRole: 'Bauhaus designer',
    perspective: 'stripping away excess to reveal functional beauty'
  },
  
  'biomimicry': {
    name: 'Biomimicry',
    category: DomainCategory.ARCHITECTURE_DESIGN,
    metaphors: ['nature-inspired solutions', 'adaptive systems', 'efficient structures'],
    questions: [
      'How would nature solve this problem?',
      'What patterns repeat across scales?',
      'Where has evolution optimized this?'
    ],
    principles: ['sustainability', 'adaptation', 'systems thinking'],
    expertRole: 'biomimetic engineer',
    perspective: 'learning from billions of years of natural R&D'
  },
  
  // MYTHOLOGY & PHILOSOPHY
  'hero_journey': {
    name: 'Hero\'s Journey',
    category: DomainCategory.MYTHOLOGY,
    metaphors: ['call to adventure', 'crossing threshold', 'return with elixir'],
    questions: [
      'What is the call to adventure here?',
      'Who are the mentors and allies?',
      'What transformation awaits?'
    ],
    principles: ['departure', 'initiation', 'return'],
    expertRole: 'mythologist',
    perspective: 'universal narrative patterns of transformation'
  },
  
  'alchemy': {
    name: 'Alchemy',
    category: DomainCategory.MYTHOLOGY,
    metaphors: ['lead to gold', 'philosopher\'s stone', 'chemical wedding'],
    questions: [
      'What base material needs transmutation?',
      'Where are the hidden catalysts?',
      'How do opposites unite?'
    ],
    principles: ['transformation', 'purification', 'conjunction'],
    expertRole: 'alchemist',
    perspective: 'spiritual transformation through material processes'
  },
  
  'zen_buddhism': {
    name: 'Zen Buddhism',
    category: DomainCategory.PHILOSOPHY,
    metaphors: ['empty mind', 'flowing water', 'gateless gate'],
    questions: [
      'What happens when we stop trying?',
      'Where is the space between thoughts?',
      'How do we act without acting?'
    ],
    principles: ['non-attachment', 'mindfulness', 'wu wei'],
    expertRole: 'Zen master',
    perspective: 'finding profound simplicity through letting go'
  },
  
  'taoism': {
    name: 'Taoism',
    category: DomainCategory.PHILOSOPHY,
    metaphors: ['yin and yang', 'flowing river', 'uncarved block'],
    questions: [
      'Where do opposites complement each other?',
      'How do we follow the natural way?',
      'What emerges from simplicity?'
    ],
    principles: ['balance', 'effortless action', 'natural order'],
    expertRole: 'Taoist sage',
    perspective: 'harmonizing with natural flow of existence'
  },
  
  // TECHNOLOGY & ENGINEERING
  'neural_networks': {
    name: 'Neural Networks',
    category: DomainCategory.TECHNOLOGY,
    metaphors: ['layered learning', 'weighted connections', 'backpropagation'],
    questions: [
      'What patterns emerge from the data?',
      'How do we adjust the weights?',
      'Where are the hidden layers?'
    ],
    principles: ['deep learning', 'gradient descent', 'activation functions'],
    expertRole: 'AI researcher',
    perspective: 'emergent intelligence from simple connected units'
  },
  
  'blockchain': {
    name: 'Blockchain',
    category: DomainCategory.TECHNOLOGY,
    metaphors: ['distributed ledger', 'consensus mechanism', 'immutable chain'],
    questions: [
      'How do we achieve consensus without central authority?',
      'What makes this tamper-proof?',
      'Where does trust emerge from trustlessness?'
    ],
    principles: ['decentralization', 'cryptographic hashing', 'proof of work'],
    expertRole: 'blockchain architect',
    perspective: 'trust through transparency and mathematical certainty'
  },
  
  'robotics': {
    name: 'Robotics',
    category: DomainCategory.TECHNOLOGY,
    metaphors: ['sensors and actuators', 'feedback loops', 'autonomous behavior'],
    questions: [
      'How does the system sense its environment?',
      'What triggers adaptive behavior?',
      'Where do we need redundancy?'
    ],
    principles: ['kinematics', 'control systems', 'computer vision'],
    expertRole: 'robotics engineer',
    perspective: 'creating autonomous agents that interact with physical world'
  },
  
  'quantum_computing': {
    name: 'Quantum Computing',
    category: DomainCategory.TECHNOLOGY,
    metaphors: ['qubits', 'superposition', 'quantum gates'],
    questions: [
      'How can we compute all possibilities at once?',
      'Where does entanglement create advantage?',
      'What collapses when we measure?'
    ],
    principles: ['quantum parallelism', 'interference', 'decoherence'],
    expertRole: 'quantum computer scientist',
    perspective: 'harnessing quantum mechanics for exponential computation'
  },
  
  // SOCIAL SYSTEMS
  'ant_colony': {
    name: 'Ant Colony',
    category: DomainCategory.SOCIAL_SYSTEMS,
    metaphors: ['pheromone trails', 'collective intelligence', 'specialized roles'],
    questions: [
      'What signals guide collective behavior?',
      'How does local action create global patterns?',
      'Where are the feedback loops?'
    ],
    principles: ['stigmergy', 'self-organization', 'emergence'],
    expertRole: 'myrmecologist',
    perspective: 'complex behaviors emerging from simple rules'
  },
  
  'stock_market': {
    name: 'Stock Market',
    category: DomainCategory.SOCIAL_SYSTEMS,
    metaphors: ['bull and bear cycles', 'market sentiment', 'invisible hand'],
    questions: [
      'What drives market psychology?',
      'Where are the hidden correlations?',
      'How do small events cascade?'
    ],
    principles: ['supply and demand', 'efficient markets', 'behavioral finance'],
    expertRole: 'market analyst',
    perspective: 'collective psychology manifesting as price movements'
  },
  
  'viral_spread': {
    name: 'Viral Spread',
    category: DomainCategory.SOCIAL_SYSTEMS,
    metaphors: ['contagion', 'network effects', 'tipping points'],
    questions: [
      'What makes something contagious?',
      'Where are the super-spreaders?',
      'How do we reach critical mass?'
    ],
    principles: ['R0 factor', 'exponential growth', 'herd immunity'],
    expertRole: 'epidemiologist',
    perspective: 'understanding how things spread through networks'
  },
  
  'democracy': {
    name: 'Democracy',
    category: DomainCategory.SOCIAL_SYSTEMS,
    metaphors: ['checks and balances', 'representation', 'collective decision'],
    questions: [
      'How do we balance majority rule with minority rights?',
      'Where does legitimacy come from?',
      'What prevents concentration of power?'
    ],
    principles: ['separation of powers', 'civic participation', 'rule of law'],
    expertRole: 'political scientist',
    perspective: 'collective self-governance through structured participation'
  },
  
  // MORE SCIENCES
  'chemistry_reactions': {
    name: 'Chemical Reactions',
    category: DomainCategory.SCIENCES,
    metaphors: ['catalysts', 'equilibrium', 'activation energy'],
    questions: [
      'What lowers the activation energy?',
      'Where is the equilibrium point?',
      'How do we shift the balance?'
    ],
    principles: ['Le Chatelier\'s principle', 'reaction kinetics', 'thermodynamics'],
    expertRole: 'chemist',
    perspective: 'transformation through molecular recombination'
  },
  
  'astronomy': {
    name: 'Astronomy',
    category: DomainCategory.SCIENCES,
    metaphors: ['gravitational pull', 'orbital mechanics', 'cosmic scale'],
    questions: [
      'What invisible forces shape the path?',
      'How does distance change perspective?',
      'Where are the gravitational centers?'
    ],
    principles: ['Kepler\'s laws', 'redshift', 'dark matter'],
    expertRole: 'astronomer',
    perspective: 'vast scales revealing fundamental forces'
  },
  
  'geology': {
    name: 'Geology',
    category: DomainCategory.SCIENCES,
    metaphors: ['tectonic forces', 'sedimentary layers', 'deep time'],
    questions: [
      'What pressures built up over time?',
      'Where do we see the layers of history?',
      'How do small changes accumulate?'
    ],
    principles: ['plate tectonics', 'uniformitarianism', 'rock cycle'],
    expertRole: 'geologist',
    perspective: 'reading Earth\'s history in stone'
  },
  
  'oceanography': {
    name: 'Oceanography',
    category: DomainCategory.SCIENCES,
    metaphors: ['ocean currents', 'tidal forces', 'abyssal depths'],
    questions: [
      'What lies beneath the surface?',
      'How do currents shape the system?',
      'Where do different waters meet?'
    ],
    principles: ['thermohaline circulation', 'upwelling', 'marine layers'],
    expertRole: 'oceanographer',
    perspective: 'understanding vast interconnected water systems'
  },
  
  // MORE PHILOSOPHY & ARTS
  'stoicism': {
    name: 'Stoicism',
    category: DomainCategory.PHILOSOPHY,
    metaphors: ['inner citadel', 'cosmic perspective', 'virtue ethics'],
    questions: [
      'What is within our control?',
      'How do we find tranquility in chaos?',
      'Where does wisdom guide action?'
    ],
    principles: ['dichotomy of control', 'amor fati', 'living according to nature'],
    expertRole: 'Stoic philosopher',
    perspective: 'maintaining equanimity through reason and virtue'
  },
  
  'impressionism': {
    name: 'Impressionism',
    category: DomainCategory.ARTS,
    metaphors: ['capturing light', 'momentary effects', 'color vibration'],
    questions: [
      'How does light change the subject?',
      'What impression does this moment leave?',
      'Where do colors interact?'
    ],
    principles: ['plein air', 'broken color', 'optical mixing'],
    expertRole: 'impressionist painter',
    perspective: 'capturing fleeting moments and light effects'
  },
  
  'theater_directing': {
    name: 'Theater Directing',
    category: DomainCategory.ARTS,
    metaphors: ['staging', 'dramatic arc', 'ensemble dynamics'],
    questions: [
      'What\'s the through-line of action?',
      'How do we build to climax?',
      'Where are the beats and pauses?'
    ],
    principles: ['blocking', 'subtext', 'dramatic tension'],
    expertRole: 'theater director',
    perspective: 'orchestrating human dynamics to tell stories'
  },
  
  'architecture_patterns': {
    name: 'Software Architecture',
    category: DomainCategory.TECHNOLOGY,
    metaphors: ['modular design', 'separation of concerns', 'design patterns'],
    questions: [
      'How do we decouple dependencies?',
      'Where are the boundaries between systems?',
      'What patterns solve this recurring problem?'
    ],
    principles: ['SOLID principles', 'microservices', 'event-driven'],
    expertRole: 'software architect',
    perspective: 'building scalable systems through proper abstraction'
  },
  
  'permaculture': {
    name: 'Permaculture',
    category: DomainCategory.NATURAL_SYSTEMS,
    metaphors: ['zones', 'guilds', 'stacking functions'],
    questions: [
      'How can each element serve multiple purposes?',
      'Where do we stack functions vertically?',
      'What are the edge effects?'
    ],
    principles: ['observe and interact', 'catch and store energy', 'obtain a yield'],
    expertRole: 'permaculture designer',
    perspective: 'designing regenerative systems based on natural patterns'
  },
  
  'game_theory': {
    name: 'Game Theory',
    category: DomainCategory.SCIENCES,
    metaphors: ['Nash equilibrium', 'prisoner\'s dilemma', 'zero-sum games'],
    questions: [
      'What\'s the optimal strategy for all players?',
      'Where does cooperation beat competition?',
      'How do we change the game rules?'
    ],
    principles: ['dominant strategy', 'Pareto efficiency', 'backward induction'],
    expertRole: 'game theorist',
    perspective: 'strategic decision-making in interactive situations'
  },
  
  'origami': {
    name: 'Origami',
    category: DomainCategory.ARTS,
    metaphors: ['unfolding complexity', 'transformation through folding', 'hidden potential'],
    questions: [
      'What emerges from a single sheet?',
      'How do constraints create possibilities?',
      'Where do folds create structure?'
    ],
    principles: ['valley and mountain folds', 'crease patterns', 'wet folding'],
    expertRole: 'origami master',
    perspective: 'creating complexity from simplicity through precise transformation'
  },
  
  'mycorrhizal_networks': {
    name: 'Mycorrhizal Networks',
    category: DomainCategory.NATURAL_SYSTEMS,
    metaphors: ['wood wide web', 'nutrient exchange', 'underground communication'],
    questions: [
      'What resources flow through hidden networks?',
      'How do separate entities support each other?',
      'Where are the network hubs?'
    ],
    principles: ['mutualistic exchange', 'resource sharing', 'chemical signaling'],
    expertRole: 'mycologist',
    perspective: 'invisible networks creating resilient communities'
  },
  
  'comedy_improv': {
    name: 'Comedy Improvisation',
    category: DomainCategory.ARTS,
    metaphors: ['yes, and...', 'building on offers', 'finding the game'],
    questions: [
      'How do we build on what\'s given?',
      'Where\'s the comedic heightening?',
      'What game are we playing?'
    ],
    principles: ['acceptance', 'support', 'escalation'],
    expertRole: 'improv comedian',
    perspective: 'creating something from nothing through collaboration'
  },
  
  'cryptography': {
    name: 'Cryptography',
    category: DomainCategory.TECHNOLOGY,
    metaphors: ['locks and keys', 'one-way functions', 'hidden messages'],
    questions: [
      'What needs to remain secret?',
      'How do we prove identity without revealing it?',
      'Where is the computational hardness?'
    ],
    principles: ['encryption', 'digital signatures', 'zero-knowledge proofs'],
    expertRole: 'cryptographer',
    perspective: 'securing information through mathematical complexity'
  }
};

/**
 * Get all domain IDs
 */
export function getAllDomainIds(): string[] {
  return Object.keys(DOMAIN_LIBRARY);
}

/**
 * Get domains by category
 */
export function getDomainsByCategory(category: DomainCategory): string[] {
  return Object.entries(DOMAIN_LIBRARY)
    .filter(([_, domain]) => domain.category === category)
    .map(([id, _]) => id);
}

/**
 * Get random domains ensuring category diversity
 */
export function getRandomDomainsWithDiversity(count: number, excludeIds: string[] = []): string[] {
  const availableIds = getAllDomainIds().filter(id => !excludeIds.includes(id));
  const selectedIds: string[] = [];
  const usedCategories = new Set<DomainCategory>();
  
  // First, try to get one from each category
  for (const category of Object.values(DomainCategory)) {
    if (selectedIds.length >= count) break;
    
    const categoryDomains = availableIds.filter(id => 
      DOMAIN_LIBRARY[id]?.category === category && !selectedIds.includes(id)
    );
    
    if (categoryDomains.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoryDomains.length);
      selectedIds.push(categoryDomains[randomIndex]!);
      usedCategories.add(category);
    }
  }
  
  // Fill remaining slots randomly
  while (selectedIds.length < count && selectedIds.length < availableIds.length) {
    const remainingIds = availableIds.filter(id => !selectedIds.includes(id));
    if (remainingIds.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * remainingIds.length);
    selectedIds.push(remainingIds[randomIndex]!);
  }
  
  return selectedIds.slice(0, count);
}
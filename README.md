# Dynamic Creative Lens Generator

An MCP (Model Context Protocol) server that helps Claude generate creative solutions through unique "perception lenses". This tool enables structured creative thinking by applying metaphors and concepts from diverse domains to analyze and solve problems.

## Overview

The Creative Lens Generator works by:
1. **Generating Creative Lenses**: Creates 5 unique perspectives using metaphors from 50+ domains
2. **Evolving Ideas**: Progressively transforms ideas with increasing creativity levels (1-10 madness scale)
3. **Cross-Pollinating Concepts**: Synthesizes hybrid solutions by merging different ideas
4. **Tracking Sessions**: Maintains context and analytics for iterative creative exploration

## Features

- 🎯 **50+ Domain Library**: From quantum physics to jazz improvisation
- 🧬 **Progressive Evolution**: Ideas evolve through 3 stages with increasing creativity
- 🔄 **Multiple Fusion Methods**: Structural, functional, dialectical, and quantum synthesis
- 📊 **Session Analytics**: Track creativity trends and most effective domains
- 💾 **State Persistence**: Save and resume creative sessions
- 🚀 **Works with any Claude subscription**: No API key required

## Quick Start

```bash
# Install and build
git clone https://github.com/yourusername/dynamic-creative-lens-generator.git
cd dynamic-creative-lens-generator
npm install && npm run build

# Configure Claude Desktop (Windows)
copy claude-desktop-config.json %APPDATA%\Claude\claude_desktop_config.json

# Configure Claude Desktop (macOS)
cp claude-desktop-config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Then restart Claude Desktop. For detailed setup, see the [Setup Guide](docs/SETUP.md).

## Usage Examples

### Generate Creative Lenses

Ask Claude:
```
Use the creative lens generator to analyze: "How can we make remote meetings more engaging?"
```

Claude will generate 5 unique perspectives, such as:
- **Jazz Improvisation Lens**: Meetings as jam sessions with call-and-response dynamics
- **Ecosystem Lens**: Meetings as living organisms with energy flows
- **Quantum Physics Lens**: Meetings existing in multiple states simultaneously

### Evolve an Idea

```
Take the "virtual reality meetings" idea and evolve it to madness level 7
```

The tool will progressively transform the idea through 3 stages, injecting concepts from random domains.

### Create Hybrid Solutions

```
Cross-pollinate "gamification" with "meditation practices" for employee wellness
```

The tool will synthesize these concepts using various fusion methods to create novel solutions.

### Session Insights

```
Show me insights from this creative session
```

Get analytics on:
- Most effective domains used
- Creativity progression trends
- Successful hybrid combinations

## Available Tools

1. **`generate_creative_lens_prompt`**
   - Creates structured prompts for 5 creative perspectives
   - Parameters: problem, complexity, domains_to_explore, avoid_domains

2. **`evolve_idea_with_structure`**
   - Progressively transforms ideas with increasing creativity
   - Parameters: current_idea, evolution_stage (1-3), desired_madness (1-10)

3. **`create_hybrid_framework`**
   - Synthesizes two concepts into novel solutions
   - Parameters: idea_a, idea_b, fusion_method, emphasis

4. **`evaluate_creativity`**
   - Assesses ideas on multiple creativity dimensions
   - Parameters: ideas[], evaluation_criteria[]

5. **`get_session_insights`**
   - Retrieves analytics and recommendations for the session
   - Parameters: session_id, insight_type

## Development

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Lint code
npm run lint

# Type checking
npm run typecheck
```

## Architecture

```
src/
├── server.ts              # Main MCP server
├── modules/
│   ├── lensGenerator/     # Creative lens generation
│   ├── ideaProcessor/     # Idea evolution system
│   ├── crossPollinator/   # Concept synthesis
│   └── stateManager/      # Session management
├── tools/                 # MCP tool definitions
├── prompts/              # Prompt templates
├── types/                # TypeScript definitions
└── utils/                # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built for the MCP (Model Context Protocol) ecosystem
- Inspired by creative thinking frameworks and lateral thinking techniques
- Domain metaphors drawn from diverse fields of human knowledge
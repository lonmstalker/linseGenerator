# Setup Guide

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Claude Desktop app

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dynamic-creative-lens-generator.git
cd dynamic-creative-lens-generator
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Claude Desktop Configuration

1. Open Claude Desktop settings
2. Navigate to Developer → Model Context Protocol
3. Add the server configuration:

```json
{
  "mcpServers": {
    "creative-lens": {
      "command": "npx",
      "args": ["tsx", "/path/to/project/src/server-entry.ts", "--silent"],
      "env": {
        "LOG_LEVEL": "error",
        "PERSISTENCE_TYPE": "file",
        "MAX_SESSIONS": "100"
      }
    }
  }
}
```

4. Restart Claude Desktop

## Development Setup

For development with hot reload:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| LOG_LEVEL | info | Logging level (debug, info, warn, error) |
| PERSISTENCE_TYPE | file | Storage type (memory, file, redis) |
| MAX_SESSIONS | 100 | Maximum concurrent sessions |
| SESSION_TIMEOUT | 3600000 | Session timeout in ms (1 hour) |

## Troubleshooting

If the server doesn't start:
1. Check Claude Desktop logs
2. Run `npm run mcp` manually to see errors
3. Ensure all paths in config are absolute
4. Verify Node.js version: `node --version`

For more details, see the main [README](../README.md).
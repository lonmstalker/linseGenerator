# Remote Server Deployment Guide

This guide explains how to deploy the Creative Lens MCP server on a remote server for use with Claude Desktop.

## Architecture

```
[Claude Desktop] <---> [SSH Tunnel] <---> [Remote MCP Server]
```

## Prerequisites

- Remote server with Node.js 16+
- SSH access to the remote server
- Claude Desktop on local machine

## Remote Server Setup

1. **Clone and setup on remote server:**
```bash
ssh user@your-server.com
git clone https://github.com/yourusername/dynamic-creative-lens-generator.git
cd dynamic-creative-lens-generator
npm install
npm run build
```

2. **Create systemd service** (for Linux servers):
```bash
sudo nano /etc/systemd/system/creative-lens-mcp.service
```

Add:
```ini
[Unit]
Description=Creative Lens MCP Server
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/home/youruser/dynamic-creative-lens-generator
ExecStart=/usr/bin/node /home/youruser/dynamic-creative-lens-generator/dist/server-entry.js
Environment="LOG_LEVEL=info"
Environment="PERSISTENCE_TYPE=file"
Environment="MAX_SESSIONS=100"
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

3. **Start the service:**
```bash
sudo systemctl enable creative-lens-mcp
sudo systemctl start creative-lens-mcp
sudo systemctl status creative-lens-mcp
```

## SSH Tunnel Configuration

### Option 1: Using SSH stdio forwarding (Recommended)

1. **Create a wrapper script** on your local machine:

`creative-lens-remote.sh`:
```bash
#!/bin/bash
ssh -T user@your-server.com \
  "cd /path/to/dynamic-creative-lens-generator && npx tsx src/server-entry.ts --silent"
```

2. **Make it executable:**
```bash
chmod +x creative-lens-remote.sh
```

3. **Configure Claude Desktop:**
```json
{
  "mcpServers": {
    "creative-lens-remote": {
      "command": "/path/to/creative-lens-remote.sh",
      "args": [],
      "env": {}
    }
  }
}
```

### Option 2: Using SSH port forwarding

1. **Modify server to use TCP transport** (create `src/server-tcp.ts`):
```typescript
import net from 'net';
import { CreativeLensServer } from './server.js';

const PORT = process.env.MCP_PORT || 3000;

const server = net.createServer((socket) => {
  const mcpServer = new CreativeLensServer();
  // Implement TCP transport adapter
  // ... (implementation details)
});

server.listen(PORT, () => {
  console.log(`MCP server listening on port ${PORT}`);
});
```

2. **Create SSH tunnel:**
```bash
ssh -L 3000:localhost:3000 user@your-server.com -N
```

3. **Configure Claude Desktop to connect to localhost:3000**

## Security Considerations

1. **Use SSH keys** instead of passwords:
```bash
ssh-copy-id user@your-server.com
```

2. **Restrict SSH access:**
   - Use fail2ban
   - Disable root login
   - Use non-standard SSH port
   - Configure firewall rules

3. **Server hardening:**
   - Keep system updated
   - Use environment variables for sensitive config
   - Implement rate limiting
   - Monitor logs

## Docker Deployment (Alternative)

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["node", "dist/server-entry.js"]
```

2. **Build and run:**
```bash
docker build -t creative-lens-mcp .
docker run -d --name creative-lens \
  -e LOG_LEVEL=info \
  -e PERSISTENCE_TYPE=file \
  -v $(pwd)/data:/app/data \
  creative-lens-mcp
```

## Monitoring

1. **Check logs:**
```bash
# Systemd
journalctl -u creative-lens-mcp -f

# Docker
docker logs -f creative-lens
```

2. **Health check endpoint** (optional):
Add a health check tool to the MCP server for monitoring.

## Troubleshooting

1. **Connection timeout:**
   - Check firewall rules
   - Verify SSH connection
   - Check server logs

2. **Permission errors:**
   - Ensure correct file ownership
   - Check directory permissions

3. **High latency:**
   - Consider geographical server location
   - Use connection pooling
   - Enable compression in SSH

## Performance Tips

1. Use persistent SSH connections
2. Enable SSH compression: `ssh -C`
3. Consider using mosh for unstable connections
4. Implement caching on the server side

For questions or issues, please open a GitHub issue.
#!/bin/bash
# SSH wrapper for remote MCP server
# Usage: Configure this script in Claude Desktop as the command

# Configuration
REMOTE_USER="${MCP_REMOTE_USER:-user}"
REMOTE_HOST="${MCP_REMOTE_HOST:-your-server.com}"
REMOTE_PATH="${MCP_REMOTE_PATH:-/home/user/dynamic-creative-lens-generator}"
SSH_KEY="${MCP_SSH_KEY:-~/.ssh/id_rsa}"

# SSH options for stability
SSH_OPTIONS="-o ServerAliveInterval=60 -o ServerAliveCountMax=3 -o TCPKeepAlive=yes"

# Use compression if available
if ssh -o Compression=yes -o ConnectTimeout=1 "$REMOTE_USER@$REMOTE_HOST" exit 2>/dev/null; then
  SSH_OPTIONS="$SSH_OPTIONS -C"
fi

# Execute remote MCP server
exec ssh -T $SSH_OPTIONS -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" \
  "cd $REMOTE_PATH && npx tsx src/server-entry.ts --silent"
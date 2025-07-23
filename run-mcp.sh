#!/bin/bash
# Silent MCP Server Launcher for Claude Desktop

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to project directory
cd "$SCRIPT_DIR"

# Run server with all output redirected to log file
LOG_FILE="$SCRIPT_DIR/mcp-server.log"

# Clear previous log
echo "[$(date)] Starting Creative Lens MCP Server..." > "$LOG_FILE"

# Run tsx silently
exec npx tsx src/server.ts 2>> "$LOG_FILE"
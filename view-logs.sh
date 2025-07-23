#!/bin/bash
# View MCP server logs

LOG_FILE="$(dirname "$0")/mcp-server.log"

if [ -f "$LOG_FILE" ]; then
    echo "=== MCP Server Logs ==="
    tail -f "$LOG_FILE"
else
    echo "No log file found at: $LOG_FILE"
    echo "The server may not have started yet."
fi
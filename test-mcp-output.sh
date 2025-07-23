#!/bin/bash

echo "Testing MCP server output..."
echo "Sending initialize request and checking for non-JSON output"
echo ""

# Create a test request
REQUEST='{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"0.1.0","capabilities":{"tools":{}}},"id":1}'

# Run the server with the request and capture output
OUTPUT=$(echo "$REQUEST" | npx tsx src/server-silent.ts 2>/dev/null)

# Check if output is valid JSON
echo "Raw output:"
echo "$OUTPUT"
echo ""

# Try to parse as JSON
if echo "$OUTPUT" | jq . >/dev/null 2>&1; then
    echo "✓ Output is valid JSON"
else
    echo "✗ Output contains non-JSON data"
    echo "First 200 chars: ${OUTPUT:0:200}"
fi
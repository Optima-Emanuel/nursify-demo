#!/bin/bash
# Script to create Edge Config in Vercel
# Prerequisites: 
#   1. Install Vercel CLI: npm i -g vercel
#   2. Login: vercel login
#   3. Link project: vercel link

echo "Creating Edge Config item 'features'..."

# Create Edge Config item using Vercel CLI
vercel env add EDGE_CONFIG --scope production <<EOF
{
  "lesson": false,
  "dialog": true,
  "test": false,
  "gamification": false
}
EOF

echo "Done! Edge Config 'features' should now be available."


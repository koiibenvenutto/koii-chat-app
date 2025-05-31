#!/bin/bash

# Build script for maia-chat-react-app
echo "Building maia-chat-react-app for production..."

# Ensure we're using the latest dependencies
npm install

# Build the production bundle
npm run build

# If netlify-cli is installed, deploy to Netlify
if command -v netlify &> /dev/null
then
    echo "Deploying to Netlify..."
    netlify deploy --prod
else
    echo "Netlify CLI not found. Install with 'npm install -g netlify-cli' to deploy directly."
    echo "Build completed successfully. Deploy the 'dist' directory manually."
fi

echo "Done!" 
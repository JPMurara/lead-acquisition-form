#!/bin/bash

echo "🚀 Publishing Conversational Form Widget to npm..."

# Check if user is logged in to npm
if ! npm whoami &> /dev/null; then
    echo "❌ You need to be logged in to npm. Run 'npm login' first."
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ ! -f "dist/index.umd.js" ]; then
    echo "❌ Build failed. dist/index.umd.js not found."
    exit 1
fi

echo "✅ Build successful!"

# Publish to npm
echo "📤 Publishing to npm..."
npm publish

if [ $? -eq 0 ]; then
    echo "✅ Successfully published to npm!"
    echo ""
    echo "🎉 Your widget is now available at:"
    echo "   - jsDelivr: https://cdn.jsdelivr.net/npm/conversational-form-widget@1.0.0/dist/index.umd.js"
    echo "   - unpkg: https://unpkg.com/conversational-form-widget@1.0.0/dist/index.umd.js"
    echo ""
    echo "📖 Embedding instructions are available in README.md and embed-example.html"
else
    echo "❌ Failed to publish to npm."
    exit 1
fi

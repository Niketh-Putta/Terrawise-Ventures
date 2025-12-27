#!/bin/bash
# Auto-sync script: Commits and pushes all changes to GitHub
# Usage: ./auto-sync.sh [commit message]

cd "$(dirname "$0")"

# Check if there are any changes
if [ -z "$(git status --porcelain)" ]; then
    echo "No changes to commit."
    exit 0
fi

# Get commit message from argument or use default
COMMIT_MSG="${1:-Auto-sync: Update code from local changes}"

# Add all changes
git add -A

# Commit with message
git commit -m "$COMMIT_MSG"

# Push to GitHub
git push origin main

if [ $? -eq 0 ]; then
    echo "✓ Successfully synced to GitHub!"
    echo "  Commit: $COMMIT_MSG"
    echo "  Vercel will automatically deploy the changes."
else
    echo "✗ Failed to push to GitHub. Please check your git configuration."
    exit 1
fi


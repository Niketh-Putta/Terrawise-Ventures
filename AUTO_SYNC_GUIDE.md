# Automatic GitHub Sync Setup

Your repository is now configured to automatically sync changes to GitHub and Vercel!

## ✅ What's Been Set Up

1. **Git Post-Commit Hook**: Automatically pushes to GitHub after every commit
2. **Auto-Sync Script**: Manual script to sync changes anytime

## How It Works

### Automatic Syncing (Recommended)

Every time you commit changes, they will **automatically push to GitHub**:

```bash
# Make your changes in the code
# Then commit:
git commit -am "Your commit message"
# The changes will automatically push to GitHub!
```

### Manual Syncing

If you want to sync all changes at once, use the auto-sync script:

```bash
./auto-sync.sh "Your commit message"
```

Or without a message (uses default):
```bash
./auto-sync.sh
```

## Vercel Auto-Deployment

Once changes are pushed to GitHub:
- ✅ Vercel automatically detects the push
- ✅ Vercel builds and deploys your changes
- ✅ Your website updates within 1-2 minutes

## Workflow

1. **Make changes** in your code editor (like you're doing now)
2. **Commit changes** - they auto-push to GitHub
3. **Vercel automatically deploys** - your website updates!

## Important Notes

- The post-commit hook only works when you commit via command line
- If you use a GUI git client, you may need to push manually
- Always check that your changes are pushed: `git status`
- View your GitHub repo: https://github.com/Niketh-Putta/Terrawise-Ventures

## Troubleshooting

If auto-push fails:
1. Check your git credentials: `git config --list`
2. Push manually: `git push origin main`
3. Check GitHub connection: `git remote -v`

## Disabling Auto-Sync

If you want to disable automatic pushing:

```bash
# Remove the hook
rm .git/hooks/post-commit
```

You can always re-enable it later or use the manual `auto-sync.sh` script.




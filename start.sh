#!/bin/sh
set -e

# Deploy Convex functions if environment variables are set
if [ -n "$CONVEX_SELF_HOSTED_URL" ] && [ -n "$CONVEX_SELF_HOSTED_ADMIN_KEY" ]; then
  echo "Deploying Convex functions to $CONVEX_SELF_HOSTED_URL..."
  echo "Note: URL should point to backend API (port 3210), not HTTP actions (port 3211)"
  cd /app
  
  # Ensure environment variables are exported for Convex CLI
  # The CLI auto-detects CONVEX_SELF_HOSTED_URL and CONVEX_SELF_HOSTED_ADMIN_KEY
  export CONVEX_SELF_HOSTED_URL="$CONVEX_SELF_HOSTED_URL"
  export CONVEX_SELF_HOSTED_ADMIN_KEY="$CONVEX_SELF_HOSTED_ADMIN_KEY"
  
  # Deploy without --url flag - CLI should auto-detect self-hosted from env vars
  # According to Convex docs, when these vars are set, CLI automatically targets self-hosted
  npx convex deploy 2>&1 || {
    DEPLOY_EXIT_CODE=$?
    echo ""
    echo "⚠️  Warning: Convex deploy failed (exit code: $DEPLOY_EXIT_CODE)"
    echo "This might be because:"
    echo "  1. The Convex project needs to be initialized first"
    echo "  2. The deploy endpoint is not available/configured on self-hosted backend"
    echo "  3. Network connectivity issues"
    echo ""
    echo "To fix this, deploy manually from your local machine:"
    echo "  export CONVEX_SELF_HOSTED_URL='$CONVEX_SELF_HOSTED_URL'"
    echo "  export CONVEX_SELF_HOSTED_ADMIN_KEY='<your-admin-key>'"
    echo "  npx convex deploy --url \$CONVEX_SELF_HOSTED_URL"
    echo ""
    echo "Continuing with application startup (functions may not be available)..."
  }
else
  echo "Skipping Convex deploy (environment variables not set)"
fi

# Start the application
echo "Starting application..."
cd /app/dist/server
exec npx srvx --prod -s ../client server.js


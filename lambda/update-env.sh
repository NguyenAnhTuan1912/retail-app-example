#!/bin/bash
set -euo pipefail

# ─── Config ───
PROFILE=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --profile) PROFILE="$2"; shift 2 ;;
    *) echo "❌ Unknown option: $1"; exit 1 ;;
  esac
done
PROFILE="${PROFILE:-$AWS_PROFILE}"
if [ -z "$PROFILE" ]; then
  echo "❌ Usage: ./update-env.sh --profile <aws-profile>  (or set AWS_PROFILE)"
  echo "   Pass env vars inline, e.g.:"
  echo "   API_KEY=xxx ./update-env.sh --profile my-profile"
  exit 1
fi

REGION="${AWS_REGION:-ap-southeast-1}"

FUNCTIONS=(
  "listProducts"
  "getProduct"
  "listCategories"
  "listOrders"
  "getOrder"
  "cancelOrder"
  "listReviews"
  "getMe"
  "getCart"
  "addToCart"
  "updateCartItem"
  "removeCartItem"
  "renderUI"
)

ENV_KEYS=(API_BASE_URL API_KEY)

# Collect provided env vars
NEW_VARS=""
for KEY in "${ENV_KEYS[@]}"; do
  VAL="${!KEY:-}"
  if [ -n "$VAL" ]; then
    [ -n "$NEW_VARS" ] && NEW_VARS="${NEW_VARS},"
    NEW_VARS="${NEW_VARS}\"${KEY}\":\"${VAL}\""
  fi
done

if [ -z "$NEW_VARS" ]; then
  echo "❌ No env vars provided. Set at least one of: ${ENV_KEYS[*]}"
  exit 1
fi

echo "🔄 Updating environment variables (merge with existing)..."
echo "─────────────────────────────────────"

for FUNC in "${FUNCTIONS[@]}"; do
  FUNC_NAME="demo-retail-${FUNC}"

  # Get current env vars
  CURRENT=$(aws lambda get-function-configuration \
    --function-name "$FUNC_NAME" \
    --profile "$PROFILE" \
    --region "$REGION" \
    --query 'Environment.Variables' \
    --output json 2>/dev/null || echo '{}')

  # Merge: current + new (new overrides)
  MERGED=$(echo "$CURRENT" | python3 -c "
import sys, json
current = json.load(sys.stdin) or {}
new = json.loads('{${NEW_VARS}}')
current.update(new)
print(json.dumps({'Variables': current}))
")

  aws lambda update-function-configuration \
    --function-name "$FUNC_NAME" \
    --environment "$MERGED" \
    --profile "$PROFILE" \
    --region "$REGION" \
    --no-cli-pager > /dev/null 2>&1

  echo "  ✅ $FUNC_NAME"
done

echo "─────────────────────────────────────"
echo "🎉 Done!"

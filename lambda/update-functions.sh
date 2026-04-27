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
  echo "❌ Usage: ./update-functions.sh --profile <aws-profile>  (or set AWS_PROFILE)"
  exit 1
fi

REGION="${AWS_REGION:-ap-southeast-1}"
API_BASE_URL="${API_BASE_URL:?❌ Set API_BASE_URL env var}"

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
)

echo "🔄 Updating environment variables for all functions..."
echo "   API_BASE_URL=$API_BASE_URL"
echo "─────────────────────────────────────"

for FUNC in "${FUNCTIONS[@]}"; do
  FUNC_NAME="demo-retail-${FUNC}"
  aws lambda update-function-configuration \
    --function-name "$FUNC_NAME" \
    --environment "Variables={API_BASE_URL=$API_BASE_URL}" \
    --profile "$PROFILE" \
    --region "$REGION" \
    --no-cli-pager > /dev/null 2>&1

  echo "  ✅ $FUNC_NAME"
done

echo "─────────────────────────────────────"
echo "🎉 Done!"

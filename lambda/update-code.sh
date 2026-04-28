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
  echo "❌ Usage: ./update-code.sh --profile <aws-profile>  (or set AWS_PROFILE)"
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

cd "$(dirname "$0")"

echo "🔧 Building..."
pnpm build

echo "📦 Packaging..."
cd dist
zip -qr ../lambda.zip .
cd ..

echo ""
echo "🚀 Updating function code..."
echo "─────────────────────────────────────"

for FUNC in "${FUNCTIONS[@]}"; do
  FUNC_NAME="demo-retail-${FUNC}"
  aws lambda update-function-code \
    --function-name "$FUNC_NAME" \
    --zip-file fileb://lambda.zip \
    --profile "$PROFILE" \
    --region "$REGION" \
    --no-cli-pager > /dev/null 2>&1

  echo "  ✅ $FUNC_NAME"
done

echo "─────────────────────────────────────"
echo "🎉 Done!"

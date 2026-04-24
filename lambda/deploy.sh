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
  echo "❌ Usage: ./deploy.sh --profile <aws-profile>  (or set AWS_PROFILE)"
  exit 1
fi

REGION="${AWS_REGION:-ap-southeast-1}"
API_BASE_URL="${API_BASE_URL:?❌ Set API_BASE_URL env var}"
API_KEY="${API_KEY:?❌ Set API_KEY env var}"
ROLE_NAME="demo-retail-lambda-role"
RUNTIME="nodejs22.x"
TIMEOUT=30
MEMORY=256

FUNCTIONS=(
  "listProducts"
  "getProduct"
  "listOrders"
  "getOrder"
  "cancelOrder"
  "listReviews"
)

echo "🔧 Building Lambda functions..."
cd "$(dirname "$0")"
pnpm build

echo "📦 Packaging..."
cd dist
zip -qr ../lambda.zip .
cd ..

# ─── IAM Role ───
echo "🔑 Setting up IAM role..."
ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --profile "$PROFILE" --query 'Role.Arn' --output text 2>/dev/null || true)

if [ -z "$ROLE_ARN" ] || [ "$ROLE_ARN" = "None" ]; then
  TRUST_POLICY='{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

  ROLE_ARN=$(aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document "$TRUST_POLICY" \
    --profile "$PROFILE" \
    --query 'Role.Arn' --output text)

  aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" \
    --profile "$PROFILE"

  echo "⏳ Waiting for IAM role propagation..."
  sleep 10
fi

echo "  Role: $ROLE_ARN"

# ─── Deploy functions ───
echo ""
echo "🚀 Deploying Lambda functions..."
echo "─────────────────────────────────────"

declare -A ARNS

for FUNC in "${FUNCTIONS[@]}"; do
  FUNC_NAME="demo-retail-${FUNC}"
  HANDLER="${FUNC}.handler"

  EXISTING=$(aws lambda get-function --function-name "$FUNC_NAME" --profile "$PROFILE" --region "$REGION" 2>/dev/null || true)

  if [ -n "$EXISTING" ]; then
    # Update
    ARN=$(aws lambda update-function-code \
      --function-name "$FUNC_NAME" \
      --zip-file fileb://lambda.zip \
      --profile "$PROFILE" \
      --region "$REGION" \
      --query 'FunctionArn' --output text)

    aws lambda update-function-configuration \
      --function-name "$FUNC_NAME" \
      --handler "$HANDLER" \
      --timeout "$TIMEOUT" \
      --memory-size "$MEMORY" \
      --environment "Variables={API_BASE_URL=$API_BASE_URL,API_KEY=$API_KEY}" \
      --profile "$PROFILE" \
      --region "$REGION" \
      --no-cli-pager > /dev/null 2>&1 || true

    echo "  ✅ Updated: $FUNC_NAME"
  else
    # Create
    ARN=$(aws lambda create-function \
      --function-name "$FUNC_NAME" \
      --runtime "$RUNTIME" \
      --role "$ROLE_ARN" \
      --handler "$HANDLER" \
      --zip-file fileb://lambda.zip \
      --timeout "$TIMEOUT" \
      --memory-size "$MEMORY" \
      --environment "Variables={API_BASE_URL=$API_BASE_URL,API_KEY=$API_KEY}" \
      --profile "$PROFILE" \
      --region "$REGION" \
      --query 'FunctionArn' --output text)

    echo "  ✅ Created: $FUNC_NAME"
  fi

  ARNS[$FUNC]="$ARN"
done

# ─── Output ───
echo ""
echo "─────────────────────────────────────"
echo "🎉 Deploy completed! Lambda ARNs:"
echo "─────────────────────────────────────"
for FUNC in "${FUNCTIONS[@]}"; do
  echo "  ${FUNC}: ${ARNS[$FUNC]}"
done
echo "─────────────────────────────────────"

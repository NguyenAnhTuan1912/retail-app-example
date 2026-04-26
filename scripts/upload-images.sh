#!/bin/bash
set -euo pipefail

# ─── Config ───
PROFILE=""
BUCKET=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --profile) PROFILE="$2"; shift 2 ;;
    --bucket) BUCKET="$2"; shift 2 ;;
    *) echo "❌ Unknown option: $1"; exit 1 ;;
  esac
done
PROFILE="${PROFILE:-$AWS_PROFILE}"
if [ -z "$PROFILE" ]; then
  echo "❌ Usage: ./upload-images.sh --profile <aws-profile> --bucket <bucket-name>"
  echo "   (or set AWS_PROFILE)"
  exit 1
fi
if [ -z "$BUCKET" ]; then
  echo "❌ --bucket is required"
  exit 1
fi

REGION="${AWS_REGION:-ap-southeast-1}"
IMAGES_DIR="$(cd "$(dirname "$0")/../images" && pwd)"

echo "📤 Uploading images to s3://$BUCKET"
echo "   Profile: $PROFILE | Region: $REGION"
echo "─────────────────────────────────────"

aws s3 sync "$IMAGES_DIR" "s3://$BUCKET" \
  --exclude ".DS_Store" \
  --profile "$PROFILE" \
  --region "$REGION"

echo "─────────────────────────────────────"
echo "🎉 Done! Images uploaded to s3://$BUCKET"

# Interact with example retail application

## How to deploy these functions to AWS

```bash
# Cách 1: --profile flag
API_BASE_URL=http://your-server:19000 API_KEY=admin-api-key-demo-retail-2026 \
  ./lambda/deploy.sh --profile my-profile

# Cách 2: AWS_PROFILE env var
AWS_PROFILE=my-profile API_BASE_URL=http://your-server:19000 API_KEY=admin-api-key-demo-retail-2026 \
  ./lambda/deploy.sh
```
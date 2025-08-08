# with-ssm 🔐

> Run any command with secrets from AWS SSM Parameter Store - no more secrets in
> `.env` files!

## What is this?

`with-ssm` is a lightweight CLI tool that automatically replaces SSM parameter
references in your environment variables with their actual values from AWS SSM
Parameter Store before executing your commands.

Think of it as a security upgrade for your development workflow - instead of
storing sensitive values directly in `.env` files, you reference SSM parameters
that get resolved at runtime.

**Why you'll love it:**

- 🚫 **No more secrets on disk** - your `.env` files only contain SSM references
- 🔄 **Always up-to-date** - secrets are fetched fresh from SSM every time
- ✅ **Safe to commit** - your `.env.with-ssm` files can be safely added to
  version control
- 🎯 **Drop-in replacement** - works with any command that uses environment
  variables

## Installation

```bash
npm install -g @0north/with-ssm
```

## Quick Start

1. **Replace secrets in your `.env` file with SSM references:**

```env
# .env.with-ssm
DATABASE_URL="SSM:/myapp/database/url"
API_KEY="SSM:/myapp/external/api-key"
JWT_SECRET="SSM:/myapp/auth/jwt-secret"
```

2. **Run your commands through with-ssm:**

```bash
with-ssm -- npm start
```

That's it! Your application gets the real secret values, but they never touch
your filesystem.

## Usage Examples

### Basic Usage

```bash
# Run any command with SSM-resolved environment variables
with-ssm -- npm start
with-ssm -- node server.js
with-ssm -- docker-compose up
```

### With Inline Environment Variables

```bash
# Mix inline SSM references with file-based ones
API_TOKEN="SSM:/external/api-token" with-ssm -- npm run deploy
```

### Custom Files

```bash
# Use specific environment files
with-ssm --file .env.production --file .env.secrets -- npm start
```

### AWS Configuration

```bash
# Use specific AWS profile and region
with-ssm --profile production --region us-west-2 -- npm start
```

### Debug Mode

```bash
# See what's happening under the hood
with-ssm --debug -- npm whoami
```

## Command Line Options

| Option      | Alias | Description                 | Default                     |
| ----------- | ----- | --------------------------- | --------------------------- |
| `--file`    | `-f`  | Environment file(s) to load | `['.env', '.env.with-ssm']` |
| `--region`  |       | AWS region for SSM          | AWS SDK default             |
| `--profile` |       | AWS profile to use          | AWS SDK default             |
| `--debug`   |       | Enable debug output         | `false`                     |
| `--help`    | `-h`  | Show help                   |                             |

## SSM Parameter Format

Use the `SSM:` prefix followed by your parameter path:

```env
# These all work:
DATABASE_PASSWORD="SSM:/myapp/db/password"
API_KEY="SSM:/external-services/stripe/api-key"
SECRET_TOKEN="SSM:/auth/jwt-secret"
```

Parameters are fetched with decryption enabled, so SecureString parameters work
out of the box.

## File Loading Priority

`with-ssm` loads environment variables in this order:

1. Current process environment
2. `.env` file (if it exists)
3. `.env.with-ssm` file (if it exists)
4. Any additional files specified with `--file`

Later files override earlier ones, just like you'd expect.

## Important Notes

### ⚠️ Application Behavior

If your application loads `.env` files directly (like with `dotenv`), it might
override the SSM-resolved values. To avoid this:

- Use `.env.with-ssm` instead of `.env` for SSM references
- Or use environment variable substitution if your app supports it:
  `${API_KEY:-SSM:/myapp/api-key}`

### 🚀 Deployment Considerations

- Don't deploy `.env` files with your application if they contain SSM references
- Consider using native AWS parameter resolution in production environments
- The tool requires AWS credentials configured (via AWS CLI, IAM roles, or
  environment variables)

## AWS Setup

Make sure you have AWS credentials configured. Any of these methods work:

```bash
# AWS CLI
aws configure

# Environment variables
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"

# IAM roles (in AWS environments)
# Automatically detected
```

Your AWS user/role needs `ssm:GetParameters` permission for the parameters
you're accessing.

## Examples in the Wild

### Node.js Development

```bash
# .env.with-ssm
DATABASE_URL="SSM:/myapp/dev/database-url"
REDIS_URL="SSM:/myapp/dev/redis-url"
STRIPE_SECRET_KEY="SSM:/myapp/stripe/secret-key"

# Run your dev server
with-ssm -- npm run dev
```

### Docker Compose

```bash
# Load secrets and start containers
with-ssm -- docker-compose up
```

### CI/CD Pipeline

```bash
# Deploy with production secrets
with-ssm --profile production -- npm run deploy
```

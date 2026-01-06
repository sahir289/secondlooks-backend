# PM2 Deployment Guide

## Initial Setup on Server

### 1. Install PM2 globally
```bash
npm install -g pm2
```

### 2. Clone the repository
```bash
cd /home/ubuntu
git clone <your-repo-url> secondlooks-backend
cd secondlooks-backend
```

### 3. Install dependencies
```bash
npm ci --production=false
```

### 4. Set up environment variables
```bash
cp .env.example .env
nano .env  # Edit with your production values
```

### 5. Generate Prisma Client
```bash
npm run prisma:generate
```

### 6. Run database migrations
```bash
npm run prisma:migrate
```

### 7. Build the project
```bash
npm run build
```

This will create the `dist` folder with compiled JavaScript files.

### 8. Start with PM2
```bash
pm2 start ecosystem.config.js --env production
```

### 9. Save PM2 configuration
```bash
pm2 save
pm2 startup
```

Follow the instructions from the `pm2 startup` command to enable PM2 on system boot.

## Common PM2 Commands

### View running processes
```bash
pm2 list
```

### View logs
```bash
pm2 logs secondlooks-api
```

### Monitor processes
```bash
pm2 monit
```

### Restart application
```bash
pm2 restart secondlooks-api
```

### Reload (zero-downtime restart)
```bash
pm2 reload secondlooks-api
```

### Stop application
```bash
pm2 stop secondlooks-api
```

### Delete process
```bash
pm2 delete secondlooks-api
```

### View detailed info
```bash
pm2 show secondlooks-api
```

## Deployment Updates

When deploying updates:

### Option 1: Using the deploy script
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual deployment
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci --production=false

# Generate Prisma Client
npm run prisma:generate

# Build
npm run build

# Run migrations
npm run prisma:migrate

# Reload PM2
pm2 reload ecosystem.config.js --env production
```

## Troubleshooting

### Check if dist folder exists
```bash
ls -la dist/
```

### Rebuild if needed
```bash
npm run build
```

### Check logs for errors
```bash
pm2 logs secondlooks-api --err
```

### Clear PM2 logs
```bash
pm2 flush
```

### Restart from scratch
```bash
pm2 delete secondlooks-api
npm run build
pm2 start ecosystem.config.js --env production
pm2 save
```

## Environment Variables

Make sure your `.env` file has production values:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="your-production-database-url"
JWT_SECRET="strong-secret-key"
JWT_REFRESH_SECRET="strong-refresh-secret-key"
CORS_ORIGIN="https://your-frontend-domain.com"
```

## PM2 with Nginx

If using Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Monitoring

PM2 provides built-in monitoring. To use PM2 Plus (optional):

```bash
pm2 link <secret_key> <public_key>
```

Get your keys from: https://app.pm2.io/

# Production Deployment Checklist

## Pre-Deployment

### Environment Variables
- [ ] Set `NODE_ENV=production`
- [ ] Configure production `DATABASE_URL`
- [ ] Generate strong `JWT_SECRET` (min 32 characters)
- [ ] Generate strong `JWT_REFRESH_SECRET`
- [ ] Set appropriate `CORS_ORIGIN` (your frontend domain)
- [ ] Configure `PORT` if needed
- [ ] Review rate limiting settings

### Database
- [ ] Set up production PostgreSQL database
- [ ] Run migrations: `npm run prisma:migrate`
- [ ] Verify database connection
- [ ] Set up automated backups
- [ ] Configure connection pooling if needed

### Security
- [ ] Review and update CORS settings
- [ ] Configure rate limiting for production load
- [ ] Set up SSL/TLS certificates
- [ ] Enable database encryption
- [ ] Review and test authentication flows
- [ ] Verify password requirements

### Code
- [ ] Run linter: `npm run lint`
- [ ] Fix all TypeScript errors
- [ ] Remove console.logs (use logger instead)
- [ ] Review error messages (don't expose sensitive info)
- [ ] Test all API endpoints
- [ ] Build project: `npm run build`

## Deployment

### Server Setup
- [ ] Install Node.js (v18+)
- [ ] Install PostgreSQL (v14+)
- [ ] Set up reverse proxy (Nginx/Apache)
- [ ] Configure firewall rules
- [ ] Set up process manager (PM2/systemd)

### Application
- [ ] Clone/upload code to server
- [ ] Install dependencies: `npm ci --production`
- [ ] Generate Prisma Client: `npm run prisma:generate`
- [ ] Build application: `npm run build`
- [ ] Set up environment variables
- [ ] Run migrations: `npm run prisma:migrate`

### Process Management (PM2 Example)
```bash
npm install -g pm2
pm2 start dist/server.js --name secondlooks-api
pm2 startup
pm2 save
```

## Post-Deployment

### Monitoring
- [ ] Set up application monitoring (New Relic, Datadog, etc.)
- [ ] Configure log aggregation
- [ ] Set up uptime monitoring
- [ ] Configure alerts for errors
- [ ] Monitor database performance

### Testing
- [ ] Test all API endpoints in production
- [ ] Verify authentication works
- [ ] Test product listing and filtering
- [ ] Check error handling
- [ ] Verify CORS settings
- [ ] Test rate limiting

### Documentation
- [ ] Document production API URL
- [ ] Update frontend to use production API
- [ ] Document deployment process
- [ ] Create runbook for common issues

## Recommended Hosting Platforms

### Backend + Database
- **Railway**: Easy deployment, includes PostgreSQL
- **Render**: Free tier available, managed PostgreSQL
- **Heroku**: Classic PaaS, Heroku Postgres
- **DigitalOcean App Platform**: Managed service
- **AWS (EC2 + RDS)**: Full control
- **Google Cloud Platform**: Cloud Run + Cloud SQL
- **Azure**: App Service + Azure Database

### Database Only
- **Supabase**: PostgreSQL with additional features
- **Neon**: Serverless PostgreSQL
- **PlanetScale**: MySQL alternative
- **AWS RDS**: Managed PostgreSQL
- **ElephantSQL**: Managed PostgreSQL

## Performance Optimization

### Application
- [ ] Enable compression middleware
- [ ] Implement caching (Redis)
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Use CDN for static assets

### Database
- [ ] Set up connection pooling
- [ ] Add appropriate indexes
- [ ] Configure query timeout
- [ ] Set up read replicas if needed

## Security Checklist

- [ ] Keep dependencies updated
- [ ] Regular security audits: `npm audit`
- [ ] Implement rate limiting per user
- [ ] Add request size limits
- [ ] Set up DDoS protection
- [ ] Configure secure headers
- [ ] Enable HTTPS only
- [ ] Implement IP whitelisting if needed
- [ ] Set up WAF (Web Application Firewall)

## Backup Strategy

- [ ] Automated daily database backups
- [ ] Test backup restoration
- [ ] Store backups in different location
- [ ] Document recovery procedures
- [ ] Set up point-in-time recovery

## Scaling Considerations

### Horizontal Scaling
- Load balancer setup
- Session management (Redis)
- Database replication
- CDN for static content

### Vertical Scaling
- Monitor resource usage
- Plan for increased capacity
- Optimize database queries
- Cache frequently accessed data

## Maintenance

### Regular Tasks
- [ ] Monitor logs daily
- [ ] Review error rates
- [ ] Update dependencies monthly
- [ ] Security patches immediately
- [ ] Database maintenance
- [ ] Performance reviews

### Updates
- Test updates in staging first
- Plan maintenance windows
- Communicate downtime to users
- Have rollback plan ready

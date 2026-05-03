# 🚀 Self-Hosted SongUp Deployment Guide

This guide covers deploying SongUp on your own infrastructure using Docker Compose with a self-hosted Convex backend.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Node.js 22.x (for development)
- ~2GB available disk space for PostgreSQL data

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Next.js Frontend (3000)               │
├─────────────────────────────────────────────────┤
│  Convex Backend (3210) ─ PostgreSQL (5432)      │
├─────────────────────────────────────────────────┤
│           Flask API (5328)                      │
└─────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Clone and Switch Branch

```bash
git clone https://github.com/rcaneill/songup.git
cd songup
git checkout self-host
```

### 2. Configure Environment

```bash
cp .env.self-host .env
# Edit .env and change DB_PASSWORD to something secure
nano .env
```

### 3. Start Services

```bash
docker-compose up -d
```

### 4. Monitor Startup

```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs -f nextjs

# Wait for "ready - started server on" message in logs
```

### 5. Access SongUp

Open http://localhost:3000 in your browser

---

## 📝 Environment Variables

### Core Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_USER` | `convex` | PostgreSQL username |
| `DB_PASSWORD` | `convex_dev_password` | PostgreSQL password (⚠️ **Change this!**) |
| `DB_NAME` | `convex` | PostgreSQL database name |
| `NEXT_PUBLIC_CONVEX_URL` | `http://localhost:3210` | Convex backend URL |
| `NODE_ENV` | `production` | Node environment |

### Optional Integrations

- `STRIPE_SECRET_KEY` - For payment processing
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Client-side Stripe key
- `NEXT_PUBLIC_POSTHOG_KEY` - Analytics (PostHog)
- `DOCS_DOMAIN` - External documentation URL

---

## 🔧 Service Details

### PostgreSQL (Port 5432)
- Stores all Convex data
- Persists to `postgres_data` volume
- Health check enabled

### Convex Backend (Port 3210)
- Runs Convex functions and database
- Initializes on first startup
- Connects to PostgreSQL

### Flask API (Port 5328)
- YouTube Music integration
- Music search and playback
- Stateless service

### Next.js Frontend (Port 3000)
- React application
- Connects to Convex backend
- Routes Flask requests via rewrite

---

## 🛠️ Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs <service-name>

# Restart all services
docker-compose restart

# Full reset (⚠️ deletes database)
docker-compose down -v
docker-compose up -d
```

### Port Already in Use

Edit `docker-compose.yml` and change port mappings:
```yaml
ports:
  - "8000:3000"  # Access on http://localhost:8000
```

### Convex Connection Issues

```bash
# Verify Convex is running
docker-compose exec convex-backend curl http://localhost:3210

# Check database connection
docker-compose exec postgres pg_isready
```

### Flask Not Responding

```bash
# Verify Flask container
docker-compose logs flask

# Test Flask directly
curl http://localhost:5328/flask/health
```

---

## 📊 Management Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nextjs

# Last 50 lines
docker-compose logs --tail=50 flask
```

### Database Operations

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U convex -d convex

# Backup database
docker-compose exec postgres pg_dump -U convex convex > backup.sql

# Restore database
docker-compose exec -T postgres psql -U convex convex < backup.sql
```

### Restart Services

```bash
# Restart one service
docker-compose restart nextjs

# Recreate services
docker-compose up -d --force-recreate

# Stop all services
docker-compose stop
```

---

## 🔒 Production Considerations

### Security Recommendations

1. **Change Database Password**
   ```bash
   # Update DB_PASSWORD in .env to a strong value
   # Use: $(openssl rand -base64 32)
   ```

2. **Use Reverse Proxy**
   - Place Nginx/Caddy in front for HTTPS
   - Disable direct port access

3. **Secure Convex**
   - Don't expose port 3210 publicly
   - Keep behind firewall

4. **Environment Variables**
   - Use `.env` for secrets (not committed)
   - Rotate sensitive keys regularly

### Performance Tuning

```yaml
# Add to postgres service for better performance:
environment:
  POSTGRES_INITDB_ARGS: "-c shared_buffers=256MB -c effective_cache_size=1GB"
```

### Persistence & Backups

```bash
# Backup database weekly
0 2 * * 0 cd /path/to/songup && docker-compose exec -T postgres pg_dump -U convex convex > backups/backup-$(date +\%Y\%m\%d).sql

# Volume location: /var/lib/docker/volumes/songup_postgres_data/_data
```

---

## 📦 Updating

### Pull Latest Changes

```bash
git pull origin self-host
docker-compose build --no-cache
docker-compose up -d
```

### Check Convex Schema

```bash
docker-compose exec convex-backend npx convex deploy
```

---

## 🗑️ Cleanup

### Stop All Services

```bash
docker-compose stop
```

### Remove Containers (Keep Data)

```bash
docker-compose down
```

### Full Reset (Delete Everything)

```bash
docker-compose down -v
```

---

## 📞 Support

- **Issues**: GitHub Issues on main repo
- **Docs**: Convex docs at https://docs.convex.dev
- **Discord**: SongUp community Discord

---

## 📝 Notes

- First startup takes 2-3 minutes as services initialize
- Database is persisted in `postgres_data` volume
- Convex schema is deployed automatically on startup
- Flask requires Python 3.x in container

---

**Last Updated**: May 2026  
**Branch**: `self-host`

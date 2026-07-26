#!/bin/bash
# E-commerce Backend — Quick Setup Script
# Usage: ./scripts/setup.sh
set -euo pipefail

echo "========================================="
echo "  E-commerce Backend — Quick Setup"
echo "========================================="

# 1. Copy environment variables
if [ ! -f .env ]; then
  cp .env.example .env
  echo "[OK] .env created from .env.example"
else
  echo "[SKIP] .env already exists"
fi

# 2. Start containers
echo ""
echo "Starting Docker containers..."
docker-compose up -d --build

echo ""
echo "Waiting for database to be healthy..."
sleep 5

# 3. Run schema migration
echo ""
echo "Running schema.sql..."
docker exec -i $(docker-compose ps -q db) psql -U postgres -d ecommerce_dev < schema.sql

# 4. (Optional) Load seed data
read -p "Load seed data? (y/N): " LOAD_SEED
if [ "$LOAD_SEED" = "y" ] || [ "$LOAD_SEED" = "Y" ]; then
  echo ""
  echo "Loading seed data..."
  docker exec -i $(docker-compose ps -q db) psql -U postgres -d ecommerce_dev < seed.sql
fi

echo ""
echo "========================================="
echo "  Setup complete!"
echo "  API:       http://localhost:3000"
echo "  Swagger:   http://localhost:3000/api/docs"
echo "  Health:    http://localhost:3000/health"
echo "========================================="

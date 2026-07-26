# E-commerce Backend — Quick Setup Script (PowerShell)
# Usage: .\scripts\setup.ps1

Write-Host "========================================="
Write-Host "  E-commerce Backend — Quick Setup"
Write-Host "========================================="

# 1. Copy environment variables
if (-not (Test-Path -LiteralPath ".env")) {
  Copy-Item -Path ".env.example" -Destination ".env"
  Write-Host "[OK] .env created from .env.example"
} else {
  Write-Host "[SKIP] .env already exists"
}

# 2. Start containers
Write-Host ""
Write-Host "Starting Docker containers..."
docker-compose up -d --build

Write-Host ""
Write-Host "Waiting for database to be healthy..."
Start-Sleep -Seconds 5

# 3. Run schema migration
Write-Host ""
Write-Host "Running schema.sql..."
$dbContainer = docker-compose ps -q db
Get-Content schema.sql | docker exec -i $dbContainer psql -U postgres -d ecommerce_dev

# 4. (Optional) Load seed data
$loadSeed = Read-Host "Load seed data? (y/N)"
if ($loadSeed -eq "y" -or $loadSeed -eq "Y") {
  Write-Host ""
  Write-Host "Loading seed data..."
  Get-Content seed.sql | docker exec -i $dbContainer psql -U postgres -d ecommerce_dev
}

Write-Host ""
Write-Host "========================================="
Write-Host "  Setup complete!"
Write-Host "  API:       http://localhost:3000"
Write-Host "  Swagger:   http://localhost:3000/api/docs"
Write-Host "  Health:    http://localhost:3000/health"
Write-Host "========================================="

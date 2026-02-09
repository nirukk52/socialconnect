#!/bin/bash

# Health check script for SocialConnect development environment.
# Verifies that all required services (database, Redis, backend, frontend, etc.) are running.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ALL_HEALTHY=true

# Load .env file to get URLs/ports
if [ -f ".env" ]; then
    # Only export lines that look like VAR=value (no spaces, no comments inline)
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ "$key" =~ ^[[:space:]]*# ]] && continue
        [[ -z "$key" ]] && continue
        # Remove quotes from value
        value="${value%\"}"
        value="${value#\"}"
        value="${value%\'}"
        value="${value#\'}"
        # Export if key is valid
        [[ "$key" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]] && export "$key=$value"
    done < .env
fi

# Default values if not in .env
FRONTEND_URL="${FRONTEND_URL:-http://localhost:4200}"
BACKEND_URL="${NEXT_PUBLIC_BACKEND_URL:-http://localhost:3000}"
REDIS_URL="${REDIS_URL:-redis://localhost:6379}"
DATABASE_URL="${DATABASE_URL:-postgresql://localhost:5432}"

# Extract host and port from URLs
extract_host_port() {
    local url="$1"
    local default_port="$2"
    # Remove protocol
    local hostport="${url#*://}"
    # Remove path
    hostport="${hostport%%/*}"
    # Remove auth (user:pass@)
    hostport="${hostport##*@}"
    # Extract host and port
    if [[ "$hostport" == *":"* ]]; then
        echo "${hostport%:*}" "${hostport##*:}"
    else
        echo "$hostport" "$default_port"
    fi
}

check_service() {
    local name="$1"
    local url="$2"
    local timeout="${3:-2}"
    
    printf "%-20s" "$name"
    
    if curl -s --connect-timeout "$timeout" --max-time "$timeout" "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Running${NC} ($url)"
        return 0
    else
        echo -e "${RED}✗ Not running${NC} ($url)"
        ALL_HEALTHY=false
        return 1
    fi
}

check_port() {
    local name="$1"
    local host="$2"
    local port="$3"
    local timeout="${4:-2}"
    
    printf "%-20s" "$name"
    
    if nc -z -w "$timeout" "$host" "$port" 2>/dev/null; then
        echo -e "${GREEN}✓ Running${NC} ($host:$port)"
        return 0
    else
        echo -e "${RED}✗ Not running${NC} ($host:$port)"
        ALL_HEALTHY=false
        return 1
    fi
}

echo ""
echo "=========================================="
echo "  SocialConnect Health Check"
echo "=========================================="
echo ""

# Check PostgreSQL
read -r db_host db_port <<< "$(extract_host_port "$DATABASE_URL" "5432")"
check_port "PostgreSQL" "$db_host" "$db_port" || true

# Check Redis
read -r redis_host redis_port <<< "$(extract_host_port "$REDIS_URL" "6379")"
check_port "Redis" "$redis_host" "$redis_port" || true

# Check Backend API
check_service "Backend API" "$BACKEND_URL" || true

# Check Frontend
check_service "Frontend" "$FRONTEND_URL" || true

# Optional: Check Temporal (if TEMPORAL_ADDRESS is set)
if [ -n "$TEMPORAL_ADDRESS" ]; then
    read -r temporal_host temporal_port <<< "$(extract_host_port "$TEMPORAL_ADDRESS" "7233")"
    check_port "Temporal" "$temporal_host" "$temporal_port" || true
else
    # Default Temporal port
    printf "%-20s" "Temporal"
    if nc -z -w 2 "localhost" "7233" 2>/dev/null; then
        echo -e "${GREEN}✓ Running${NC} (localhost:7233)"
    else
        echo -e "${YELLOW}○ Not configured${NC} (localhost:7233)"
    fi
fi

echo ""
echo "=========================================="

if [ "$ALL_HEALTHY" = true ]; then
    echo -e "${GREEN}All required services are running!${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}Some services are not running.${NC}"
    echo ""
    echo "Tips:"
    echo "  - PostgreSQL & Redis: Run 'pnpm run dev:docker' or start manually"
    echo "  - Backend & Frontend: Run 'pnpm dev' from root"
    echo "  - Temporal: Optional, needed for scheduled posts"
    echo ""
    exit 1
fi

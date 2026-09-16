#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Date Booking API - Development Server${NC}\n"

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate venv
echo "Activating virtual environment..."
source venv/bin/activate

# Install/update requirements
echo "Installing dependencies..."
pip install -q -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env created. Update it with your DATABASE_URL and SECRET_KEY${NC}\n"
fi

# Run server
echo -e "${GREEN}✓ Starting server...${NC}"
echo -e "${GREEN}📚 API Docs: http://localhost:8000/docs${NC}\n"

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

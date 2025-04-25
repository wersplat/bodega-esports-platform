#!/bin/bash
set -e

# Build the frontend
cd frontend
npm install
npx vite build
npx serve -s dist &

# Start the backend
cd ../backend
export PYTHONPATH=$PYTHONPATH:$(pwd)
export PORT=${PORT:-10000}
uvicorn app.main:app --host 0.0.0.0 --port $PORT

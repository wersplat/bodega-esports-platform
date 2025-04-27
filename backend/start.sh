#!/bin/bash
set -e

# Always ensure we're in the backend folder
cd "$(dirname "$0")"

# Export Python path
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Default port to 10000 if not set
export PORT=${PORT:-10000}

# Start Uvicorn with FastAPI app
uvicorn app.main:app --host 0.0.0.0 --port $PORT

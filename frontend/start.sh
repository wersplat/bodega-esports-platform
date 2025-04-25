#!/bin/bash

# Activate virtual environment if needed (Render does this automatically for Python)
# source venv/bin/activate

# Run FastAPI using uvicorn, binding to Render's required PORT env var
uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}

#!/bin/bash
set -e

export PYTHONPATH=$PYTHONPATH:$(pwd)
export PORT=${PORT:-10000}

uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT

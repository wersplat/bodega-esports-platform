#!/bin/bash
cd /opt/bodega-esports/bodega-esports-platform/backend || exit
if [ -f ../venv/bin/activate ]; then
uvicorn app.main:app --host 0.0.0.0 --port 8000
else
	echo "Error: Virtual environment not found at ../venv/bin/activate"
	exit 1
fi
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

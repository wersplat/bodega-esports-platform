#!/bin/bash
cd /opt/bodega-esports/bodega-esports-platform/backend || exit
source ../venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

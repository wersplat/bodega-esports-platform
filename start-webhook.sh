#!/bin/bash
cd /opt/bodega-esports/webhook || exit
source "$(dirname "$0")/../bodega-esports-platform/venv/bin/activate"
uvicorn webhook_main:app --host 0.0.0.0 --port 8001

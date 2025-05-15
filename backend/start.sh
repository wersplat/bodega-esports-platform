#!/usr/bin/env bash
set -e

# Move into wherever start.sh lives
cd "$(dirname "$0")"

# Debug output
echo "🔍 Working dir: $(pwd)"
echo "🔍 Files here:"
ls -la
echo "🔍 PYTHONPATH: $PYTHONPATH"
echo "🔍 PORT: $PORT"

# Now actually run Uvicorn
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-10000}"

#!/bin/bash
./build-and-commit.sh || {
  echo "❌ Pre-push check failed. Push aborted."
  exit 1
}


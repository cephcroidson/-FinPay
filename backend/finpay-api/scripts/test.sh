#!/usr/bin/env bash

set -euo pipefail

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$BACKEND_DIR/.env.test"

if [[ ! -f "$ENV_FILE" ]]; then
    echo "ERROR: $ENV_FILE does not exist."
    echo "Create the test environment file first."
    exit 1
fi

set -a
source "$ENV_FILE"
set +a

cd "$BACKEND_DIR"

exec ./mvnw "$@"

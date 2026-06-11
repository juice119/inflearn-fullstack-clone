#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ "${SKIP_TEST_INFRA_SETUP:-}" != "1" ]; then
  sh script/initIntegrationTest.sh
fi

exec pnpm start

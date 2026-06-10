#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../backend"

files=()
for f in "$@"; do
  if [[ "$f" == *"/_gen/"* ]]; then
    continue
  fi
  files+=("${f#backend/}")
done

if [[ ${#files[@]} -eq 0 ]]; then
  exit 0
fi

npx eslint --fix --max-warnings=0 --no-warn-ignored "${files[@]}"
npx prettier --write "${files[@]}"

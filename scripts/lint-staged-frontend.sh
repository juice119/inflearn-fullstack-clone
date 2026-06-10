#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../frontend"

files=()
for f in "$@"; do
  if [[ "$f" == *"/generated/"* ]]; then
    continue
  fi
  files+=("${f#frontend/}")
done

if [[ ${#files[@]} -eq 0 ]]; then
  exit 0
fi

npx eslint --fix --max-warnings=0 --no-warn-ignored "${files[@]}"
npx prettier --write "${files[@]}"

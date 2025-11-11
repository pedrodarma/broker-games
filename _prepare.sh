#!/bin/bash

# Check if we are in a CI environment
if [ "$CI" = "true" ]; then
  exit 0
fi

if [ "$CI" = "1" ]; then
  exit 0
fi

chmod -R +x ./_scripts

if ! [ -f ".git/hooks/pre-commit" ]; then
  echo "File does not exist."
  UPDATED=$(bash ./_scripts/update_git_hooks.sh)
fi
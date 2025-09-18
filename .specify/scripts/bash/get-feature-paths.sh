#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"
eval $(get_feature_paths)
if ! check_feature_branch "$CURRENT_BRANCH"; then
	echo "Proceeding with FEATURE override if provided. Current FEATURE_DIR: $FEATURE_DIR" >&2
fi
echo "REPO_ROOT: $REPO_ROOT"; echo "BRANCH: $CURRENT_BRANCH"; echo "FEATURE_DIR: $FEATURE_DIR"; echo "FEATURE_SPEC: $FEATURE_SPEC"; echo "IMPL_PLAN: $IMPL_PLAN"; echo "TASKS: $TASKS"

#!/usr/bin/env bash
# (Moved to scripts/bash/) Common functions and variables for all scripts

get_repo_root() { git rev-parse --show-toplevel; }
get_current_branch() { git rev-parse --abbrev-ref HEAD; }

check_feature_branch() {
    local branch="$1"
    local override="${FEATURE:-${SPECIFY_FEATURE:-}}"
    if [[ -n "$override" ]]; then
        # When FEATURE is provided, do not enforce branch naming
        return 0
    fi
    if [[ ! "$branch" =~ ^[0-9]{3}- ]]; then
        echo "WARN: Not on a feature branch. Current branch: $branch" >&2
        echo "Hint: export FEATURE=001-auth (or SPECIFY_FEATURE) to target a feature when not on that branch." >&2
        return 1
    fi; return 0
}

get_feature_dir() {
    local repo_root="$1"; local branch_or_feature="$2"; local override="${FEATURE:-${SPECIFY_FEATURE:-}}"
    if [[ -n "$override" ]]; then echo "$repo_root/specs/$override"; else echo "$repo_root/specs/$branch_or_feature"; fi
}

get_feature_paths() {
    local repo_root=$(get_repo_root)
    local current_branch=$(get_current_branch)
    local feature_dir=$(get_feature_dir "$repo_root" "$current_branch")
    cat <<EOF
REPO_ROOT='$repo_root'
CURRENT_BRANCH='$current_branch'
FEATURE_DIR='$feature_dir'
FEATURE_SPEC='$feature_dir/spec.md'
IMPL_PLAN='$feature_dir/plan.md'
TASKS='$feature_dir/tasks.md'
RESEARCH='$feature_dir/research.md'
DATA_MODEL='$feature_dir/data-model.md'
QUICKSTART='$feature_dir/quickstart.md'
CONTRACTS_DIR='$feature_dir/contracts'
EOF
}

check_file() { [[ -f "$1" ]] && echo "  ✓ $2" || echo "  ✗ $2"; }
check_dir() { [[ -d "$1" && -n $(ls -A "$1" 2>/dev/null) ]] && echo "  ✓ $2" || echo "  ✗ $2"; }

#!/usr/bin/env bash
# Two panes (left: server, right: front). Requires tmux: brew install tmux
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SESSION="admin-1000-dev"

if ! command -v tmux >/dev/null 2>&1; then
  echo "tmux is required for split panes. Install with: brew install tmux" >&2
  exit 1
fi

if tmux has-session -t "$SESSION" 2>/dev/null; then
  tmux kill-session -t "$SESSION"
fi

tmux new-session -d -s "$SESSION" -c "$ROOT/server" "npm run dev"
tmux split-window -h -t "$SESSION" -c "$ROOT/front" "npm run start:dev"
exec tmux attach -t "$SESSION"

#!/usr/bin/env bash
set -euo pipefail

SESSION="rudi"
BASE="/root/rudi-portal/rudi-microservice"
PROFILE="dev"

services=(registry gateway apigateway acl konsult kalim kos strukture projekt selfdata)

# If session exists from a previous run, kill it to start clean
tmux has-session -t "$SESSION" 2>/dev/null && tmux kill-session -t "$SESSION"

# First window
first="${services[0]}"
tmux new-session -d -s "$SESSION" -n "$first" \
  "cd $BASE/rudi-microservice-$first/rudi-microservice-$first-facade && mvn spring-boot:run -Dspring-boot.run.profiles=$PROFILE"

# Other windows
for s in "${services[@]:1}"; do
  tmux new-window -t "$SESSION" -n "$s" \
    "cd $BASE/rudi-microservice-$s/rudi-microservice-$s-facade && mvn spring-boot:run -Dspring-boot.run.profiles=$PROFILE"
done

# Tile layout (optional):
tmux select-layout tiled

# Attach so you can see all windows (Ctrl+b, n/p to switch)
tmux attach -t "$SESSION"

#!/usr/bin/env sh
# Wait for MySQL inside the database container to accept connections.
# (TCP port open is not enough; MySQL may still be initializing.)
timeout=90
elapsed=0
while [ $elapsed -lt $timeout ]; do
  if docker compose --env-file .env.local exec -T database mysqladmin ping -h localhost -P 3306 2>/dev/null; then
    echo "Database is ready."
    exit 0
  fi
  echo "Waiting for database... (${elapsed}s/${timeout}s)"
  sleep 3
  elapsed=$((elapsed + 3))
done
echo "Timeout waiting for database."
exit 1

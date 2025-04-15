#!/usr/bin/env bash

MODES=("sequential" "workers" "child")
OUTPUT_DIR="io-results"
mkdir -p "$OUTPUT_DIR"

for mode in "${MODES[@]}"; do
    echo "[INFO] Testing $mode..."
    OUT="$OUTPUT_DIR/results-$mode.txt"
    >"$OUT"

    if [ "$mode" = "sequential" ]; then
        bun run ./io/server-sequential.js &
        SERVER_PID=$!
        PORT=3000
    elif [ "$mode" = "workers" ]; then
        bun run ./io/server-workers.js &
        SERVER_PID=$!
        PORT=3100
    else
        bun run ./io/server-child.js &
        SERVER_PID=$!
        PORT=3200
    fi

    echo "[INFO] Launched server (PID=$SERVER_PID) on port $PORT. Wait 3s..."
    sleep 3

    for i in {1..5}; do
        echo "Run $i" >>"$OUT"
        wrk -t4 -c100 -d10s http://localhost:$PORT/json >>"$OUT"
        echo "" >>"$OUT"
    done

    echo "[INFO] Killing server PID=$SERVER_PID..."
    kill -INT $SERVER_PID 2>/dev/null
    sleep 1
done

echo "[INFO] All tests done. Results in $OUTPUT_DIR."

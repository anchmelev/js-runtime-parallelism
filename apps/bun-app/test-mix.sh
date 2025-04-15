#!/usr/bin/env bash

MODES=("sequential" "workers" "child")
OUTPUT_DIR="mix-results-v5"
mkdir -p "$OUTPUT_DIR"

for mode in "${MODES[@]}"; do
    echo "[INFO] Starting scenario: $mode"

    if [ "$mode" = "sequential" ]; then
        PORT=4000
        SCRIPT="mix-sequential.js"
    elif [ "$mode" = "workers" ]; then
        PORT=4100
        SCRIPT="mix-workers.js"
    else
        # child
        PORT=4200
        SCRIPT="mix-child.js"
    fi

    OUT="$OUTPUT_DIR/results-$mode.txt"
    >"$OUT"

    echo "[INFO] Launching 'bun run $SCRIPT' => logs -> $OUT"
    bun run "mix/$SCRIPT" >>"$OUT" 2>&1 &
    SERVER_PID=$!

    echo "[INFO] PID=$SERVER_PID (port=$PORT). Sleep 2s..."
    sleep 2

    for i in {1..5}; do
        echo "Run #$i" >>"$OUT"
        wrk -t4 -c100 -d5s "http://localhost:$PORT/json" >>"$OUT"
        echo "" >>"$OUT"
    done

    echo "[INFO] Killing scenario (PID=$SERVER_PID)..."
    kill -INT $SERVER_PID 2>/dev/null
    sleep 1

    echo "[INFO] Done with $mode => $OUT"
    echo "======================================="
done

echo "[INFO] All scenarios completed => logs in $OUTPUT_DIR"

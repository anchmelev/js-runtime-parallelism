#!/usr/bin/env bash

MODES=("sequential" "workers" "child")
OUTPUT_DIR="mix-results"
mkdir -p "$OUTPUT_DIR"

for mode in "${MODES[@]}"; do
    echo "[INFO] Starting scenario: $mode"

    # Выберем порт
    if [ "$mode" = "sequential" ]; then
        PORT=4000
        SCRIPT="mix/mix-sequential.js"
    elif [ "$mode" = "workers" ]; then
        PORT=4100
        SCRIPT="mix/mix-workers.js"
    else
        PORT=4200
        SCRIPT="mix/mix-child.js"
    fi

    # Имя файла
    OUT="$OUTPUT_DIR/results-$mode.txt"
    >"$OUT"

    echo "[INFO] Launching 'node $SCRIPT' => logs -> $OUT"
    # Запускаем со stdout+stderr в тот же файл
    node "$SCRIPT" >>"$OUT" 2>&1 &
    SERVER_PID=$!

    echo "[INFO] PID = $SERVER_PID (port=$PORT). Sleep 2s..."
    sleep 2

    # 5 повторов wrk
    for i in {1..5}; do
        echo "Run $i" >>"$OUT"
        wrk -t4 -c100 -d5s "http://localhost:$PORT/json" >>"$OUT"
        echo "" >>"$OUT"
    done

    echo "[INFO] Killing server PID=$SERVER_PID..."
    kill -INT $SERVER_PID 2>/dev/null
    sleep 1

    echo "[INFO] Done with $mode. Results in $OUT"
    echo "================================================"
done

echo "[INFO] All scenarios completed. Logs in $OUTPUT_DIR"

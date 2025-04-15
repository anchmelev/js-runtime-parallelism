#!/usr/bin/env bash

# test-mix.sh
# -------------------------
# Запуск: chmod +x test-mix.sh
# ./test-mix.sh
# -------------------------

MODES=("sequential" "workers" "childprocs")
OUTPUT_DIR="mix-results"
mkdir -p "$OUTPUT_DIR"

# 1) Проверим, есть ли бинарник для childprocs
#    (только если используем childCalcBinary)
BINARY="./mix/childCalcBinary"
CHILD_SRC="./mix/childCalc.ts"

echo "[INFO] Binary $BINARY not found. Compiling $CHILD_SRC..."
deno compile --allow-read --output "$BINARY" "$CHILD_SRC"

# 2) Для каждого варианта запускаем «смешанный» сценарий.
for mode in "${MODES[@]}"; do
    echo ""
    echo "========================================"
    echo "[INFO] Testing mix-$mode..."

    OUTFILE="$OUTPUT_DIR/results-mix-$mode.txt"
    >"$OUTFILE" # Очистим файл перед записью

    case $mode in
    sequential)
        echo "[INFO] Starting sequential mix..."
        deno run --allow-net --allow-read mix/mix-sequential.ts &
        SERVER_PID=$!
        PORT=4000
        ;;
    workers)
        echo "[INFO] Starting workers mix..."
        deno run --allow-net --allow-read mix/mix-workers.ts &
        SERVER_PID=$!
        PORT=4100
        ;;
    childprocs)
        echo "[INFO] Starting child-procs mix..."
        deno run --allow-run --allow-net --allow-read mix/mix-childprocs.ts &
        SERVER_PID=$!
        PORT=4200
        ;;
    esac

    echo "[INFO] Server PID = $SERVER_PID"
    echo "[INFO] Waiting 5 seconds for server (and/or CPU tasks) to start..."
    sleep 5

    echo "[INFO] Starting wrk tests on port $PORT..."

    # Сколько раз запускаем wrk — решайте сами, например, 3-5
    for i in {1..5}; do
        echo "" >>"$OUTFILE"
        echo "Run #$i" >>"$OUTFILE"
        echo "[INFO] Run #$i (mix-$mode) - hitting http://localhost:$PORT/"
        wrk -t4 -c100 -d5s http://localhost:$PORT/json | tee -a "$OUTFILE"
    done

    echo "[INFO] Stopping server (PID=$SERVER_PID)..."
    kill -TERM "$SERVER_PID" 2>/dev/null
    sleep 1

    # Проверяем, жив ли ещё процесс
    if kill -0 "$SERVER_PID" 2>/dev/null; then
        echo "[WARN] Process $SERVER_PID still alive, sending kill -9..."
        kill -9 "$SERVER_PID"
    fi

    echo "[INFO] Server stopped (or was forcibly killed)."
    sleep 1
done

echo ""
echo "========================================"
echo "[INFO] All tests done. See results in '$OUTPUT_DIR/'."

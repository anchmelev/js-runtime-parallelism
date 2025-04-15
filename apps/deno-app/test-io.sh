#!/usr/bin/env bash

# -------------------------
# test-io.sh
# -------------------------
# Запуск: chmod +x test-io.sh
# ./test-io.sh
#
# Если в WSL возникают ошибки "Database lock protocol error",
# можно перед запуском скрипта выставить DENO_DIR и/или очистить кэш:
#
#   export DENO_DIR="/home/andrei/deno_cache"
#   rm -rf "$DENO_DIR"
#   pkill deno
#   ./test-io.sh
#
# -------------------------

MODES=("sequential" "workers" "child")
OUTPUT_DIR="io-results"
mkdir -p "$OUTPUT_DIR"

# 1) Проверим, есть ли бинарник для child-server
BINARY="./io/childServerBinary"
echo "[INFO] Binary $BINARY not found. Compiling child-server.ts..."
deno compile --allow-net --output=./io/childServerBinary ./io/child-server.ts

# 2) Тестируем
for mode in "${MODES[@]}"; do
    echo ""
    echo "========================================"
    echo "[INFO] Testing $mode..."

    OUTFILE="$OUTPUT_DIR/results-$mode.txt"
    >"$OUTFILE" # Очистим файл перед записью

    case $mode in
    sequential)
        echo "[INFO] Starting sequential server..."
        deno run --allow-net ./io/server-sequential.ts &
        SERVER_PID=$!
        PORT=3000
        ;;
    workers)
        echo "[INFO] Starting workers server..."
        deno run --allow-net --allow-read ./io/server-workers.ts &
        SERVER_PID=$!
        PORT=3100
        ;;
    child)
        echo "[INFO] Starting child-proc server..."
        deno run --allow-run --allow-net --allow-read ./io/server-child.ts &
        SERVER_PID=$!
        PORT=3200
        ;;
    esac

    echo "[INFO] Server PID = $SERVER_PID"
    echo "[INFO] Waiting 5 seconds for server to start..."
    sleep 5

    echo "[INFO] Starting wrk tests on port $PORT..."
    for i in {1..5}; do
        echo ""
        echo "[INFO] Run $i ($mode) - hitting http://localhost:$PORT/json"
        echo "Run $i" >>"$OUTFILE"
        # Дублируем вывод wrk и в файл, и в консоль:
        wrk -t4 -c100 -d10s "http://localhost:$PORT/json" | tee -a "$OUTFILE"
        echo "" >>"$OUTFILE"
    done

    echo "[INFO] Stopping server (PID=$SERVER_PID)..."
    kill -TERM "$SERVER_PID"
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
echo "[INFO] All tests done. Results in '$OUTPUT_DIR/'."

#!/usr/bin/env bash

MODES=("sequential" "workers" "child")
OUTPUT_DIR="io-results"
mkdir -p "$OUTPUT_DIR"

# Путь к wrk, если он не в /usr/local/bin
WRK="wrk"

for mode in "${MODES[@]}"; do
    echo "Testing $mode..."
    OUTPUT_FILE="$OUTPUT_DIR/results-$mode.txt"
    >"$OUTPUT_FILE"

    # Стартуем сервер (в фоновом режиме)
    if [ "$mode" = "sequential" ]; then
        node ./io/server-sequential.js &
        SERVER_PID=$!
        PORT=3000
    elif [ "$mode" = "workers" ]; then
        node ./io/server-workers.js &
        SERVER_PID=$!
        PORT=3100 # Можно тестить только порт 3100 (первый)
    else
        # child
        node ./io/server-child.js &
        SERVER_PID=$!
        PORT=3200
    fi

    # Ждем 2с, чтобы сервер точно стартовал
    sleep 2

    for i in {1..5}; do
        echo "Run $i" >>"$OUTPUT_FILE"

        # Запускаем wrk на 10s, к URL http://localhost:$PORT/json
        $WRK -t8 -c100 -d10s http://localhost:$PORT/json >>"$OUTPUT_FILE"
        echo "" >>"$OUTPUT_FILE"
    done

    # Останавливаем сервер
    kill -INT $SERVER_PID
    sleep 1

    echo "Done testing $mode."
done

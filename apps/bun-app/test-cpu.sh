#!/usr/bin/env bash

# test-cpu.sh
# Запуск: chmod +x test-cpu.sh
# ./test-cpu.sh

MODES=("sequential" "workers" "childprocs")

for mode in "${MODES[@]}"; do
    echo "Testing $mode..."
    >"./results/results-$mode.txt" # очистим или создадим файл

    for i in {1..5}; do
        echo "Run $i" >>"./results/results-$mode.txt"
        # Запускаем bun run для cpu-$mode.js
        bun run "./cpu/cpu-$mode.js" >>"./results/results-$mode.txt"
    done
done

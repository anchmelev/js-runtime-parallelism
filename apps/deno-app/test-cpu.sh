#!/usr/bin/env bash

# test-cpu.sh
# Запуск: chmod +x test-cpu.sh

MODES=("sequential" "workers" "childprocs")

# 1) Сначала компилируем скрипт cpu-child-worker.ts в бинарник
#    чтобы при "childprocs" запускался уже готовый бинарь, а не
#    deno run заново. Путь и имя бинарника - на ваше усмотрение
# echo "Compiling cpu-child-worker.ts to reduce overhead..."
# deno compile --allow-read=./ --allow-env --allow-run \
#     -o ./cpu/cpu-child-worker-binary ./cpu/cpu-child-worker.ts

# Убеждаемся, что бинарник исполняемый
# chmod +x ./cpu/cpu-child-worker-binary

# 2) Теперь запускаем разные режимы
for mode in "${MODES[@]}"; do
    echo "Testing $mode..."
    echo "" >"./results/results-$mode.txt"

    for i in {1..5}; do
        echo "Run $i" >>"./results/results-$mode.txt"

        if [ "$mode" = "childprocs" ]; then
            #   В "childprocs" скрипте вы уже НЕ будете дергать "deno run",
            #   а пойдете напрямую:  cmd: ["./cpu-child-worker-binary"]
            #   Поэтому сам cpu-childprocs.ts можно вызывать со стандартными правами
            deno run --allow-all "./cpu/cpu-$mode.ts" >>"./results/results-$mode.txt"
        else
            # sequential / workers - без изменений
            deno run --allow-all "./cpu/cpu-$mode.ts" >>"./results/results-$mode.txt"
        fi

    done
done

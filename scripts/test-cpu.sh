#!/usr/bin/env bash

# scripts/test-cpu.sh
# Запуск: chmod +x scripts/test-cpu.sh
# Далее из папки scripts: ./test-cpu.sh

# --------------------------
# 1. Подготовка общей папки results
# --------------------------
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)" # Путь к папке scripts/
RESULTS_DIR="$SCRIPT_DIR/results"

echo "Удаляем старую папку results (если есть) и создаём заново..."
rm -rf "$RESULTS_DIR"
mkdir -p "$RESULTS_DIR"

# --------------------------
# 2. Тесты Node
# --------------------------
echo "=== Запуск тестов Node (node-app) ==="
cd "$SCRIPT_DIR/../apps/node-app"

rm -rf results
mkdir -p results

./test-cpu.sh

# Создадим папку node-app внутри scripts/results
mkdir -p "$RESULTS_DIR/node-app"
# Копируем все файлы из node-app/results/* в scripts/results/node-app
cp -r results/* "$RESULTS_DIR/node-app"

# --------------------------
# 3. Тесты Deno
# --------------------------
echo "=== Запуск тестов Deno (deno-app) ==="
cd "$SCRIPT_DIR/../apps/deno-app"

if [ -f "./cpu/cpu-child-worker-binary" ]; then
    echo "Бинарник cpu-child-worker-binary уже существует, пересборка не требуется."
else
    echo "Бинарник отсутствует, компилируем..."
    deno compile --allow-read=./ --allow-env --allow-run \
        -o ./cpu/cpu-child-worker-binary ./cpu/cpu-child-worker.ts
    chmod +x ./cpu/cpu-child-worker-binary
fi

rm -rf results
mkdir -p results

./test-cpu.sh

mkdir -p "$RESULTS_DIR/deno-app"
cp -r results/* "$RESULTS_DIR/deno-app"

# --------------------------
# 4. Тесты Bun
# --------------------------
echo "=== Запуск тестов Bun (bun-app) ==="
cd "$SCRIPT_DIR/../apps/bun-app"

rm -rf results
mkdir -p results

./test-cpu.sh

mkdir -p "$RESULTS_DIR/bun-app"
cp -r results/* "$RESULTS_DIR/bun-app"

# --------------------------
# 5. Итог
# --------------------------
echo "Все тесты завершены!"
echo "Результаты лежат в папке: $RESULTS_DIR"

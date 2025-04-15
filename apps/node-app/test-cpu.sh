# test-cpu.sh

MODES=("sequential" "workers" "childprocs")

for mode in "${MODES[@]}"; do
    echo "Testing $mode..."
    for i in {1..5}; do
        echo "Run $i"
        node "./cpu/cpu-$mode.js" >>./results/results-$mode.txt
    done
done

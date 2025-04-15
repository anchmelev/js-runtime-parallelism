console.time("heavyCalc total");

async function runChildProcess(binaryPath: string): Promise<string> {
  // Запускаем не `deno run`, а напрямую бинарник
  const p = Deno.run({
    cmd: [binaryPath], // <-- просто ./cpu-child-worker-binary
    stdout: "piped",
    stderr: "piped",
  });

  const status = await p.status();

  const rawOutput = await p.output();
  const outputStr = new TextDecoder().decode(rawOutput);

  const rawError = await p.stderrOutput();
  const errorStr = new TextDecoder().decode(rawError);

  p.close();

  if (!status.success) {
    throw new Error(`Child process failed: ${errorStr}`);
  }

  return outputStr.trim();
}

(async () => {
  const WORKERS_COUNT = 4;
  // Путь к бинарнику, который мы скомпилировали
  const binaryPath = new URL("./cpu-child-worker-binary", import.meta.url)
    .pathname;

  const promises: Array<Promise<string>> = [];
  for (let i = 0; i < WORKERS_COUNT; i++) {
    promises.push(runChildProcess(binaryPath));
  }

  const results = await Promise.all(promises);

  console.timeEnd("heavyCalc total");
  console.log("All results:", results);
})();

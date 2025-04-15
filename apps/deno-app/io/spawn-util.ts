// spawn-util.ts
export async function runChild(port: number) {
  const p = Deno.run({
    cmd: [
      "deno",
      "run",
      "--allow-net",
      new URL("./child-server.ts", import.meta.url).pathname,
      String(port),
    ],
    stdout: "inherit",
    stderr: "inherit",
  });
  // Мы не дожидаемся завершения, тк хотим оставить процесс живым
  // p.status() => вернет promise, но если we do "await p.status()",
  // то будем висеть до завершения.
}

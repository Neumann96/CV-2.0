import { fileURLToPath } from "node:url";

const [command, ...args] = process.argv.slice(2);

if (!["dev", "build", "start"].includes(command)) {
  throw new Error("Expected dev, build, or start.");
}

const cli = new URL("../node_modules/next/dist/bin/next", import.meta.url);
const port = process.env.PORT || (command === "dev" ? "5173" : "3000");
const serverArgs = command === "dev"
  ? ["-p", port]
  : command === "start"
    ? ["-p", port, "-H", "0.0.0.0"]
    : [];

process.argv = [
  process.execPath,
  fileURLToPath(cli),
  command,
  ...serverArgs,
  ...args,
];

await import(cli.href);

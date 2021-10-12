import { exec } from "child_process";
import fs from "fs-extra";
import yargs from "yargs-parser";
import os from "os";

$.os = os;

process.on("uncaughtException", () => {});

const join = (strings: TemplateStringsArray, values: any[]) => {
  let si = 0,
    vi = 0,
    t = strings.length + values.length,
    p = true,
    out = "";
  while (si + vi < t) {
    if (p) out += strings[si++];
    else out += values[vi++];
    p = !p;
  }
  return out;
};

function capture(
  cmd: string,
  ctx: {
    silent: boolean;
    env?: Record<string, any>;
  }
): Promise<string> {
  return new Promise((resolve) =>
    setTimeout(() => {
      let data = "";
      const child = exec(cmd, { env: ctx.env });
      child.on("exit", () => resolve(data.trim()));
      child.on("error", (e) => $.fail(e.message));

      child.stdout?.on("data", (chunk) => (data += chunk));
      child.stderr?.on("data", (chunk) => (data += chunk));

      !ctx.silent && child.stdout?.pipe(process.stdout);
      !ctx.silent && child.stderr?.pipe(process.stderr);
      !ctx.silent &&
        console.log(
          `$ ${Object.entries(ctx.env ?? {})
            .map(([k, v]) => `${k}="${v}"`)
            .join(" ")} ${cmd}`
        );
    }, 0)
  );
}

interface PromiseExtra {
  silent: Promise<string> & PromiseExtra;
}

function $(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<string> & PromiseExtra {
  const cmd = join(strings, values);
  const ctx = { silent: false, env: {} };

  const out: any = capture(cmd, ctx);
  Object.defineProperty(out, "silent", {
    get() {
      ctx.silent = true;
      return out;
    },
  });
  return out;
}

$.exists = async (path: string) => fs.pathExists(path);

// @ts-ignore
$.pkg = await fs.readJSON(new URL("../package.json", import.meta.url));

// @ts-ignore
$.key = Promise.resolve("");
{
  // @ts-ignore
  delete $.key;
  // @ts-ignore
  Object.defineProperty($, "key", {
    get() {
      return new Promise(async (resolve) => {
        process.stdin.setRawMode(true);
        process.stdin.once("data", (data) => {
          process.stdin.setRawMode(false);
          // @ts-ignore
          resolve(data.toString("utf8"));
        });
      });
    },
  });
}

$.argv = yargs(process.argv.slice(2));

// @ts-ignore
$.remote = Promise.resolve("");
{
  // @ts-ignore
  delete $.remote;
  // @ts-ignore
  Object.defineProperty($, "remote", {
    get() {
      return new Promise(async (resolve) =>
        resolve(await $`git remote show`.silent)
      );
    },
  });
}

$.branch = {
  get default() {
    return new Promise(async (resolve) => {
      const remote = await $`git remote show`.silent;
      const output = await $`git remote show ${remote}`.silent;
      resolve(output.match(/HEAD branch: (.*)/)?.[1] ?? "master");
    });
  },
  get active() {
    return $`git rev-parse --abbrev-ref HEAD`.silent;
  },
};

$.dedent = (strings: TemplateStringsArray, ...values: any[]) => {
  const lines = join(strings, values).trim().split("\n");
  const last = lines.slice(-1)[0];
  const spaces = last.length - last.trimStart().length;
  const re = new RegExp(`^\\s{0,${spaces}}`, "m");
  return lines.map((line) => line.replace(re, "")).join("\n");
};

$.fail = (message: string) => {
  console.error(message);
  process.exit(1);
};

const colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

const createColorFn = (color: string) => (text: string) =>
  `${color}${text}${colors.Reset}`;

export const green = createColorFn(colors.FgGreen);
export const red = createColorFn(colors.FgRed);
export const blue = createColorFn(colors.FgBlue);

export default $;

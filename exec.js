// @ts-check
import { exec } from "child_process";
import fs from "fs-extra";
import yargs from "yargs-parser";

process.on("uncaughtException", () => {});

const join = (/** @type {TemplateStringsArray } */ strings, /** @type {any[]} */ values) => {
  let si = 0, vi = 0, t = strings.length + values.length, p = true, out = "";
  while (si + vi < t) {
    if (p) out += strings[si++];
    else out += values[vi++];
    p = !p;
  }
  return out;
}

/** @returns {Promise<string>} */
function capture(/** @type {string} */ cmd, /** @type {{silent: boolean}} */ ctx) {
  return new Promise((resolve, reject) => setTimeout(() => {
    let data = "";
    const child = exec(cmd, (error) => {
      if (error) $.fail(error.message);
      else resolve(data.trim());
    });

    child.stdout?.on("data", chunk => data += chunk);
    child.stderr?.on("data", chunk => data += chunk);

    !ctx.silent && child.stdout?.pipe(process.stdout);
    !ctx.silent && child.stderr?.pipe(process.stderr);
    !ctx.silent && console.log(`$ ${cmd}`);
  }, 0))
}

/** @returns {Promise<string> & { silent: Promise<string> }} */
function $(/** @type {TemplateStringsArray} */ strings, /** @type {any[]} */ ...values) {
  const cmd = join(strings, values);
  const ctx = { silent: false };
  
  /** @type {any} */
  const out = capture(cmd, ctx);
  Object.defineProperty(out, "silent", {
    get() {
      ctx.silent = true;
      return out;
    }
  });
  return out;
}

$.exists = async (/** @type {string} */ path) => fs.pathExists(path);

$.argv = yargs(process.argv.slice(2));

$.branch = {
  get default() {
    return new Promise(async resolve => {
      const remote = await $`git remote show`.silent;
      const output = await $`git remote show ${remote}`.silent;
      resolve (output.match(/HEAD branch: (.*)/)?.[1] ?? "master");
    });
  },
  get active() {
    return $`git rev-parse --abbrev-ref HEAD`.silent
  }
}

$.fail = (/** @type {string} */ message) => {
  console.error(message);
  process.exit(1);
}

export default $;

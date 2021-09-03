import { exec } from "child_process";
import fs from "fs-extra";
import parser from "yargs-parser";

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

/** @returns {Promise<string | null>} */
function capture(/** @type {string} */ cmd, silent = false) {
  return new Promise((resolve, reject) => {
    let data = "";
    const child = exec(cmd, (error) => {
      if (error) {
        if (!$.continueOnError) reject();
        else resolve(null);
      }
      else resolve(data.trim());
    });
    child.stdout.on("data", chunk => data += chunk);
    child.stderr.on("data", chunk => data += chunk);
    !silent && child.stdout.pipe(process.stdout);
    !silent && child.stderr.pipe(process.stderr);
  })
}
export default function $(/** @type {TemplateStringsArray } */ strings, /** @type {any[]} */ ...values) {
  const cmd = join(strings, values);
  console.log(`$ ${cmd}`);
  return capture(cmd);
}
$.silent = function(/** @type {TemplateStringsArray } */ strings, /** @type {any[]} */ ...values) {
  return capture(join(strings, values), true);
}
$.continueOnError = true;
$.exists = async (/** @type {string} */ path) => fs.pathExists(path);
$.argv = parser(process.argv.slice(2));
// @ts-check
import $ from "../exec.js";

async function rebase() {

}

export default async function(/** @type {string[]} */ pos, /** @type {Record<string, any>} */ flags) {
  const base = await $.branch.default;
  const active = await $.branch.active;
  const remote = await $`git remote`.silent;

  const [branch = base] = pos;

  if (active === branch) $.fail(`Active branch is equal to the target branch, use \`gitp sync\` for rebasing a branch over itself.`);
  
  const hasChanges = !(await $`git stash`.silent).includes("No local changes");

  await $`git fetch`;
  const info = await $`git pull --rebase ${remote} ${base}`;
  //console.log(info);
}
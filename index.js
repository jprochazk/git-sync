#!/usr/bin/env node

import $ from "./exec.js";

$.continueOnError = false;

let [branch] = $.argv._;

if (await $.exists(".git")) {
  const hasChanges = !(await $.silent`git stash`).includes("No local changes");
  const initialBranch = await $.silent`git rev-parse --abbrev-ref HEAD`;
  branch ??= "master";
  if (!branch) branch = "master";
  if (branch === "this") branch = initialBranch;
  await $`git fetch`;
  await $`git checkout ${branch}`;
  await $`git pull --rebase origin ${branch}`;
  if (branch !== initialBranch) await $`git checkout ${initialBranch}`;
  if (hasChanges) await $`git stash pop`;
} else {
  console.log("Not a git repository");
}

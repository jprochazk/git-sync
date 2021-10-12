import $ from "../util.js";

export default async function (pos: string[], flags: Record<string, any>) {
  const base = await $.branch.default;
  const active = await $.branch.active;
  const remote = await $`git remote`.silent;

  let [branch = base] = pos;
  if (branch === "this") branch = active;

  const hasChanges = !(await $`git stash`.silent).includes("No local changes");

  await $`git fetch`;
  await $`git checkout ${branch}`;
  await $`git pull --rebase ${remote} ${branch}`;

  if (branch !== active) await $`git checkout ${active}`;

  if (hasChanges) await $`git stash pop`;
}

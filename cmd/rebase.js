// @ts-check
import $, { green } from "../util.js";

export default async function(/** @type {string[]} */ pos, /** @type {Record<string, any>} */ flags) {
  flags.stash ??= flags.s ?? false;
  const base = await $.branch.default;
  const active = await $.branch.active;

  const [branch = base] = pos;

  if (active === branch) $.fail($.dedent`
    Active branch is equal to the target branch,
    use \`gitp sync this\` to rebase a branch over its remote counterpart.
    `);
  
  const hasChanges = !(await $`git stash`).includes("No local changes");
  if (hasChanges && !flags.stash) {
    await $`git stash pop`;
    $.fail(`You have unsaved changes, please stash/commit them, or run the command again with the \`--stash\` flag.`);
  }

  console.log("Fetching updates...");
  await $`git fetch`.silent;
  console.log("Attempting rebase...");
  const status = await $`git rebase ${branch}`.silent;
  if (status.includes("up to date")) {
    console.log("Everything is up to date");
  } else {
    if (status.includes("git rebase --continue")) {
      console.log("Starting interactive rebase...");
      console.log(`Press ${green("A")} to abort, any other key to continue.`);
      
      let conflicts = [...status.matchAll(/Merge conflict in (.+)/g)].map(e => e[1]);
      while (true) {
        console.log(`Please resolve conflicts in: ${conflicts.map(t => green(t)).join(" ")}`);
        const key = await $.key;
        console.log(`got: ${key}`);
        if (key === 'a') {
          await $`git rebase --abort`.silent;
          console.log("Rebase aborted");
          break;
        }

        console.log("Continuing...");
        await $`git add ${conflicts.join(" ")}`.silent;
        const status = $.os.platform() === 'win32'
          ? await $`cmd /V /C "set GIT_EDITOR=true && git rebase --continue"`.silent
          : await $`GIT_EDITOR=true git rebase --continue`.silent;
        if (status.includes("Successfully rebased")) {
          console.log("Rebase successful");
          break;
        }
        conflicts = [...status.matchAll(/Merge conflict in (.+)/g)].map(e => e[1]);
      }
    }
  }

  if (hasChanges && flags.stash) {
    await $`git stash pop`;
  }
}
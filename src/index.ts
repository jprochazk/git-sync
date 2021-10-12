#!/usr/bin/env node

import $ from "./util.js";

const help = `
Usage: gitp <cmd> [args]

Shortcuts for common git operations
  
gitp [--help|-h]
  Display this message

gitp [--version|-v]
  Displays the CLI version

gitp sync <branch> [--help|-h]
  Convenient synchronization with remote branches

  <branch>      - Branch name; master, main, my-feature-branch, etc.
                  Use keyword \`this\` to sync the branch that is currently active
  [--help|-h]   - Display this message.

gitp rebase <branch> [--stash|-s] [--help|-h]
  Smart interactive rebase

  <branch>      - Branch name; master, main, my-feature-branch, etc.
                  Omit to automatically use HEAD branch
  [--stash|-s]  - Stash changes before rebasing.
  [--help|-h]   - Display this message.

gitp check
  Checks if \`gitp\` can be used in the current directory
`;

const {
  $0,
  _: [cmd, ...pos],
  ...flags
} = $.argv;

if (flags.version || flags.v) {
  console.log($.pkg.version);
  process.exit(0);
}

if (!cmd || flags.help || flags.h) {
  console.log(help);
  process.exit(0);
}

if (!(await $.exists(".git")))
  $.fail("`gitp` may only run in a git repository root");
if (!(await $.remote)) $.fail("Repository has no remote");

import sync from "./cmd/sync.js";
import rebase from "./cmd/rebase.js";

switch (cmd) {
  case "check":
    break;
  case "sync":
    await sync(pos, flags);
    break;
  case "rebase":
    await rebase(pos, flags);
    break;
  default:
    $.fail(
      `Invalid command: \`${cmd}\`. See \`gitp help\` for a list of available commands`
    );
}

// HACK: Something is keeping the process alive at this point, so forcibly exit
process.exit(0);

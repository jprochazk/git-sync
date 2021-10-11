#!/usr/bin/env node
// @ts-check

import $ from "./exec.js";

const help =
`
Usage: gitp <cmd> [args]

Shortcuts for common git operations

gitp sync <branch> [--help|-h]
  Synchronizes a branch with its remote counterpart in a convenient way.

  <branch>      - Branch name; master, main, my-feature-branch, etc.
                  Use keyword \`this\` to sync the branch that is currently active
  [--help|-h]   - Display this message.

gitp rebase <branch> [--help|-h]
  Equivalent to \`git pull --rebase <remote> <branch>\`, but without
  having to specify <remote> or ensuring that <branch> is up to date.

  <branch>      - Branch name; master, main, my-feature-branch, etc.
                  Omit to automatically use HEAD branch
  [--help|-h]   - Display this message.
  
gitp help
  Display this message
`;

const { $0, _: [cmd, ...pos], ...flags } = $.argv;

if (!cmd || cmd === "help" || flags.help || flags.h) {
  console.log(help);
  process.exit(0);
}

if (!(await $.exists(".git"))) $.fail("`gitp` may only run in a git repository root");

import sync from "./cmd/sync.js";
import rebase from "./cmd/rebase.js";

switch (cmd) {
  case "sync": await sync(pos, flags); break;
  case "rebase": await rebase(pos, flags); break;
  default: $.fail(`Invalid command: \`${cmd}\`. See \`gitp help\` for a list of available commands`);
}

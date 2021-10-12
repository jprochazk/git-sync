# git plus

Node.js CLI for automating common git operations

### Installation

1. Clone the repository
2. `$ yarn up`

### Usage

```
gitp [--help|-h]
  Display this message

gitp [--version|-v]
  Displays the CLI version

gitp sync <branch> [--help|-h]
  Synchronizes a branch with its remote counterpart in a convenient way.

  <branch>      - Branch name; master, main, my-feature-branch, etc.
                  Use keyword \`this\` to sync the branch that is currently active
  [--help|-h]   - Display this message.

gitp rebase <branch> [--stash|-s] [--help|-h]
  Equivalent to \`git rebase <branch>\`, but without having to ensure
  that <branch> is up to date. This command requires that there are
  no unsaved changes.

  <branch>      - Branch name; master, main, my-feature-branch, etc.
                  Omit to automatically use HEAD branch
  [--stash|-s]  - Stash changes before rebasing.
  [--help|-h]   - Display this message.

gitp check
  Checks if \`gitp\` can be used in the current directory
```

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
```

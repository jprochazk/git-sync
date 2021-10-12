# git plus

Node.js CLI for automating common git operations

### Installation

```
$ yarn global add https://github.com/jprochazk/gitp.git
```

You _must_ use Yarn to install this package. Ensure the path
returned by `yarn global bin` is in your PATH.

NPM _is not able to install this package from GIT_, because it
doesn't correctly install dev dependencies, which means the
package can't be built.

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
  [--stash|-s]  - Stash changes before rebasing
  [--help|-h]   - Display this message.

gitp check
  Checks if \`gitp\` can be used in the current directory
```

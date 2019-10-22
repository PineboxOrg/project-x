#!/usr/bin/env node

console.log('🐟🐟🐟 Validating git commit message 🐟🐟🐟');
const gitMessage = require('child_process')
  .execSync('git log -1 --no-merges')
  .toString()
  .trim();
const matchCommit = /(chore|build|feat|fix|refactor|style|docs|test)\((backend|testing|web|stryker|repo)\):\s(([a-z0-9:\-\s])+)/g.test(
  gitMessage
);
const matchRelease = /release/gi.test(gitMessage);
const exitCode = +!(matchRelease || matchCommit);

if (exitCode === 0) {
  console.log('Commit ACCEPTED 👌');
} else {
  console.log(
    '[Error]: Ho no! 😦 Your commit message: \n' +
      '-------------------------------------------------------------------\n' +
      gitMessage +
      '\n-------------------------------------------------------------------' +
      '\n\n 👉️ Does not follow the commit message convention specified in the CONTRIBUTING.MD file.'
  );
  console.log('\ntype(scope): subject \n BLANK LINE \n body');
  console.log('\n');
  console.log('possible types: chore|build|feat|fix|refactor|style|docs');
  console.log('possible scopes: stryker|workbox|repo (if unsure use "repo")');
  console.log('\nEXAMPLE: \n' + 'feat(stryker): add a new package\n');
}
process.exit(exitCode);

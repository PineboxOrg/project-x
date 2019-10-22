#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

function allFilesInDir(dirName) {
  let res = [];
  try {
    fs.readdirSync(dirName).forEach(c => {
      const child = path.join(dirName, c);
      try {
        const s = fs.statSync(child);
        if (path.extname(child) === '.ts') {
          res.push({
            name: child,
            content: fs.readFileSync(child).toString()
          });
        } else if (s.isDirectory()) {
          res = [...res, ...allFilesInDir(child)];
        }
      } catch (e) {}
    });
  } catch (e) {}
  return res;
}

function check() {
  const exceptions = [];

  const files = [
    ...allFilesInDir('packages/stryker'),
    ...allFilesInDir('packages/workbox')
  ];

  const invalidFiles = [];
  files.forEach(f => {
    if (f.content.indexOf('@schematics/angular') > -1) {
      invalidFiles.push(f.name);
    }
    if (f.content.indexOf('@angular/') > -1) {
      invalidFiles.push(f.name);
    }
    if (f.content.indexOf("'@angular-devkit/build-angular';") > -1) {
      invalidFiles.push(f.name);
    }
    if (f.content.indexOf('@angular-devkit/build-angular/') > -1) {
      invalidFiles.push(f.name);
    }
  });

  return invalidFiles.filter(f => !exceptions.includes(f));
}

const invalid = check();
if (invalid.length > 0) {
  console.error(
    'The following files import @schematics/angular or @angular/* or @angular-devkit/build-angular'
  );
  invalid.forEach(e => console.log(e));
  process.exit(1);
} else {
  process.exit(0);
}

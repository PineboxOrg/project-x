import { exec, execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

export function getCwd(): string {
  return process.cwd();
}

function patchPackageJsonDeps(projPath) {
  const p = JSON.parse(readFileSync(`${projPath}/package.json`).toString());
  const strykerPath = path.join(getCwd(), 'build', 'packages', 'stryker');

  p.devDependencies['@nrwl/workspace'] = `8.4.12`;
  p.devDependencies['@nrwl/angular'] = `8.4.12`;

  p.devDependencies['@angular-plugins/stryker'] = `file:${strykerPath}`;
  writeFileSync(`${projPath}/package.json`, JSON.stringify(p, null, 2));
}

export function createAngularProject(project: string = 'proj') {
  const projPath = `./tmp/angular/${project}`;
  execSync(`./node_modules/.bin/ng new ${project} --directory=${projPath} --no-interactive --skip-install`).toString();
  patchPackageJsonDeps(projPath);
  runYarnInstallDefault(projPath);
}

export function createAngularNRWLProject(project: string = 'proj') {
  const projPath = `tmp/nrwl/${project}`;
  console.log(execSync(`./node_modules/.bin/ng new ${project} --directory=${projPath} --no-interactive --skip-install --collection=@nrwl/workspace --npmScope=${project}`).toString());
  patchPackageJsonDeps(projPath);
  runYarnInstallDefault(projPath);
}

function runYarnInstallDefault(projPath: string, silent: boolean = true) {
  try {
    console.log(execSync('yarn install', {
      cwd: projPath
    }).toString());
    const install = execSync('ls -la', {
      cwd: projPath,
      ...(silent ? { stdio: ['ignore', 'ignore', 'ignore'] } : {})
    });

  } catch (error) {
    console.error(error);
  }
  // return install ? install.toString() : '';
}

export function runAngularCLICommand(
  projPath: string,
  command: string,
  opts = {
    silenceError: false
  }
): string {
  try {

    return execSync(`./node_modules/.bin/ng ${command}`, {
      cwd: `./tmp/angular/${projPath}`
    })
      .toString()
  } catch (e) {
    if (opts.silenceError) {
      return e.stdout.toString();
    } else {
      console.log(e.stdout.toString(), e.stderr.toString());
      throw e;
    }
  }
}

export function runNRWLCLICommand(
  projPath: string,
  command: string,
  opts = {
    silenceError: false
  }
): string {
  try {

    return execSync(`./node_modules/.bin/ng ${command}`, {
      cwd: `./tmp/nrwl/${projPath}`
    })
      .toString()
  } catch (e) {
    if (opts.silenceError) {
      return e.stdout.toString();
    } else {
      console.log(e.stdout.toString(), e.stderr.toString());
      throw e;
    }
  }
}

export function runAngularCommand(projPath:string,command: string): string {
  try {
    return execSync(command, {
      cwd: `./tmp/angular/${projPath}`,
      stdio: ['pipe', 'pipe', 'pipe']
    }).toString();
  } catch (e) {
    return e.stdout.toString() + e.stderr.toString();
  }
}

export function runCommandAsync(
  projPath: string,
  command: string,
  opts = {
    silenceError: false
  }
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: `./tmp/angular/${projPath}`
      },
      (err, stdout, stderr) => {
        // console.error({err, stdout, stderr });
        if (!opts.silenceError && err) {
          reject(err);
        }
        resolve({ stdout, stderr });
      }
    );
  });
}
export function expectMutationFail(v: { stdout: string; stderr: string }) {
  // console.warn('The command fail for ' + v.stderr);
  expect(v.stderr).toContain('Failed to ran mutation tests\nerror Command failed with exit code 1.\n');
}
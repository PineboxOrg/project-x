import {
  chain,
  externalSchematic,
  Rule,
  apply,
  url,
  template,
  move,
  Tree,
  TypedSchematicContext
} from '@angular-devkit/schematics';
import { getProjectConfig, getWorkspace, readJsonInTree, updateWorkspaceInTree, readWorkspace } from '@nrwl/workspace';
import { mergeWith } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { join, normalize } from '@angular-devkit/core';
import init from '../init/init';

function isNrwlWorkspace(host: Tree): boolean {
  const workspaceJson = readJsonInTree(host, 'angular.json');
  return new Map(workspaceJson).has('newProjectRoot');
}

function concatPath(value: string, path: string, startPath: string = './') {
  const finalPath = `${startPath}${value}${path}`;
  return finalPath;
}

function generateFile(options: Schema): Rule {
  return (host, context) => {
    const workspaceJson = readWorkspace(host);
    const projectConfig = getProjectConfig(host, options.project);
    const root = projectConfig.root.length === 0 ? '' : `${projectConfig.root}/`;
    let libsFolder = (workspaceJson.newProjectRoot && workspaceJson.newProjectRoot.length) ? workspaceJson.newProjectRoot:'libs';

    return mergeWith(
      apply(url('./files'), [
        template({
          tmpl: '',
          ...options,
          testRunner:'command',
          commandRunner: {
              command: `yarn test ${options.project}` 
          },
          plugins: [
            "@stryker-mutator/typescript",
            "@stryker-mutator/html-reporter"
          ],
          files: [
            concatPath(libsFolder, '/**/*.ts'),
            concatPath(libsFolder, '/**/*.html'),
            concatPath(root, 'src/**/*.ts'),
            concatPath(root, 'src/**/*.html'),
            concatPath(root, 'src/**/*.scss'),
            concatPath(root, '*.json'),
            concatPath(root, '*.js'),
            concatPath('', '*.js'),
            concatPath('', 'tsconfig.json'),
            concatPath('', 'package.json'),
          ],
          mutate: [
            concatPath(root, 'src/**/*.ts'),
            concatPath(root, 'src/**/*.spec.ts', '!./'),
            concatPath(root, 'src/main.ts', '!./'),
            concatPath(root, 'src/**/*.module.ts', '!./'),
          ],
        }),

        move(projectConfig.root),
      ])
    )(host, context);
  };
}

function updateWorkspaceJson(options: Schema): Rule {
  return updateWorkspaceInTree(json => {
    const projectConfig = json.projects[options.project];
    projectConfig.architect.mutate = {
      builder: '@angular-plugins/stryker:mutate',
      options: {
        configFile: join(normalize(projectConfig.root), 'stryker.config.js'),
      }
    };
    return json;
  });
}

function check(options: Schema): Rule {
  return (host: Tree, context: TypedSchematicContext<{},{}>) => {
    const projectConfig = getProjectConfig(host, options.project);
    if (projectConfig.architect.mutate) {
      throw new Error(
        `${options.project} already has a mutate architect option.`
      );
    }
    return host;
  };
}

export default function (options: Schema): Rule {
  return chain([
    init(),
    check(options),
    generateFile(options), 
    updateWorkspaceJson(options)]);
}
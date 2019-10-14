import {
  chain,
  externalSchematic,
  Rule,
  apply,
  url,
  template,
  move,
  Tree
} from '@angular-devkit/schematics';
import { getProjectConfig, getWorkspace, readJsonInTree } from '@nrwl/workspace';
import { mergeWith } from '@angular-devkit/schematics';
import { Schema } from './schema';

function isNrwlWorkspace(host: Tree): boolean {
  const workspaceJson = readJsonInTree(host, 'angular.json');
  return new Map(workspaceJson).has('newProjectRoot');
}

function concatPath(value: string, path: string, startPath: string = './') {
  const finalPath = `${startPath}${value}${path}`;
  return finalPath;
}

function generateFiles(options: Schema): Rule {
  return (host, context) => {
    const workspaceJson = readJsonInTree(host, 'angular.json');
    const projectConfig = getProjectConfig(host, options.project);
    const root = projectConfig.root ? '' : `${projectConfig.root}/`;
    let libsFolder = (workspaceJson.newProjectRoot && workspaceJson.newProjectRoot.length) ? workspaceJson.newProjectRoot:'libs';

   
    return mergeWith(
      apply(url('./files'), [
        template({
          tmpl: '',
          ...options,
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
          ]
        }),

        move(projectConfig.root)
      ])
    )(host, context);
  };
}

export default function (options: Schema): Rule {
  return chain([generateFiles(options)]);
}
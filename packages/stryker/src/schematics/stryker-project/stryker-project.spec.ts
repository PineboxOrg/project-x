import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree, updateJsonInTree } from '@nrwl/workspace';
import { runSchematic, callRule } from '../../../utils/testing';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';

describe('stryker-project', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = Tree.empty();
    appTree = createEmptyWorkspace(appTree);
    appTree = await callRule(
      updateJsonInTree('workspace.json', json => {
        json.projects.lib1 = {
          root: 'libs/lib1',
          architect: {
            lint: {
              builder: '@angular-devkit/build-angular:tslint',
              options: {
                tsConfig: []
              }
            }
          }
        };
        return json;
      }),
      appTree
    );
    appTree = await callRule(
      updateJsonInTree('libs/lib1/tsconfig.json', json => {
        return {
          compilerOptions: {
            types: []
          }
        };
      }),
      appTree
    );
  });

  it('should generate files', async () => {
    const resultTree = await runSchematic(
      'stryker-project',
      { project: 'lib1' },
      appTree
    );
    expect(resultTree.exists('/libs/lib1/stryker.config.js')).toBeTruthy();
  });

  it('should stryker file with mutator property', async () => {
    const resultTree = await runSchematic(
      'stryker-project',
      { project: 'lib1' },
      appTree
    );
    const content = resultTree.readContent('/libs/lib1/stryker.config.js');
    expect(stripIndents`${content}`).toBe(stripIndents`
    
    module.exports = function(config) {
         config.set({
           mutator: 'typescript',
           testRunner: 'command',
           commandRunner: {
             command: 'yarn test lib1' 
           },
           plugins: [ '@stryker-mutator/typescript',
           '@stryker-mutator/html-reporter',
          ],
           packageManager: 'yarn',
           coverageAnalysis: 'off',
           files: [ './libs/**/*.ts',
            './libs/**/*.html',
            './libs/lib1/src/**/*.ts',
            './libs/lib1/src/**/*.html',
            './libs/lib1/src/**/*.scss',
            './libs/lib1/*.json',
            './libs/lib1/*.js',
            './*.js',
            './tsconfig.json',
            './package.json',
           ],
           mutate: [ './libs/lib1/src/**/*.ts',
            '!./libs/lib1/src/**/*.spec.ts',
            '!./libs/lib1/src/main.ts',
            '!./libs/lib1/src/**/*.module.ts',
           ],
           timeoutMS: 500000,
           reporters: ['html,clear-text,progress']
         });
       };`);
    expect(resultTree.exists('/libs/lib1/stryker.config.js')).toBeTruthy();
  });

  //   it('should not override existing files', async () => {
  //     appTree.create('jest.config.js', `test`);
  //     const resultTree = await runSchematic('ng-add', {}, appTree);
  //     expect(resultTree.read('jest.config.js').toString()).toEqual('test');
  //   });

  //   it('should add dependencies', async () => {
  //     const resultTree = await runSchematic('init', {}, appTree);
  //     const packageJson = readJsonInTree(resultTree, 'package.json');
  //     expect(packageJson.devDependencies.jest).toBeDefined();
  //     expect(packageJson.devDependencies['@nrwl/jest']).toBeDefined();
  //     expect(packageJson.devDependencies['@types/jest']).toBeDefined();
  //     expect(packageJson.devDependencies['ts-jest']).toBeDefined();
  //   });
});

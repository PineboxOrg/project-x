  
import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree, updateJsonInTree } from '@nrwl/workspace';
import { runSchematic, callRule } from '../../../utils/testing';

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
    const resultTree = await runSchematic('stryker-project', {project: 'lib1'}, appTree);
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
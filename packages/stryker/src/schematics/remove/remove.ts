import {
  chain,
  noop,
  Rule,
  Tree,
  SchematicContext
} from '@angular-devkit/schematics';
import {
  addDepsToPackageJson,
  readJsonInTree,
  updateJsonInTree
} from '@nrwl/workspace';
import {
  strykerMutatorApi,
  strykerMutatorCore,
  strykerMutatorHtmlReporter,
  strykerMutatorJestRunner,
  strykerMutatorTypescript,
  strykerMutatorKarmaRunner
} from '../../../utils/versions';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

function removeDependency() {
  return updateJsonInTree('package.json', json => {
    json.dependencies = json.dependencies || {};
    delete json.dependencies['@stryker-mutator/api'];
    delete json.dependencies['@stryker-mutator/core'];
    delete json.dependencies['@stryker-mutator/jest-runner'];
    delete json.dependencies['@stryker-mutator/typescript'];
    delete json.dependencies['@stryker-mutator/karma-runner'];
    return json;
  });
}

export default function() {
  return chain([removeDependency()]);
}

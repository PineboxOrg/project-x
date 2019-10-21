import {
    createAngularProject, runAngularCLICommand, createAngularNRWLProject, runNRWLCLICommand, expectMutationFail, runCommandAsync
  } from './utils';


    describe('Stryker', () => {
      it('should be able test projects using stryker', async done => {
          // create a new AngularCLI app
          createAngularProject('sample');
          // runAngularCLICommand('sample','generate library lib1');
          runAngularCLICommand('sample','generate @angular-plugins/stryker:stryker-project sample');
          expectMutationFail(await runCommandAsync('sample', 'yarn ng run sample:mutate', {
            silenceError: true
          }));
  
        expect(true).toBe(true);
        done();
      }, 50000);
      it.skip('should be able test projects using stryker', async done => {
        // create a new AngularCLI app
        createAngularNRWLProject('sample');
        runNRWLCLICommand('sample','generate @nrwl/angular:application sample');
        runNRWLCLICommand('sample','generate @angular-plugins/stryker:stryker-project sample');
        ;
        expectMutationFail(await runCommandAsync('sample', 'yarn ng run sample:mutate', {
          silenceError: true
        }));

      expect(true).toBe(true);
      done();
    }, 50000);
    });

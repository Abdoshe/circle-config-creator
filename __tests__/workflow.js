/* @flow */

import Workflow from '../src/workflow';
import Job from '../src/job';
import Filter from '../src/filter';
import Branches from '../src/branches';

describe('Workflow', () => {
  it('can create a simple workflow', () => {
    const w = new Workflow('test-workflow');

    const job = new Job('test-job');

    expect(w.job(job).compose()).toMatchSnapshot();
  });

  it('can require another job to run', () => {
    const w = new Workflow('test-workflow');

    const job = new Job('test-job');
    const requires = new Job('required-by-test-job');

    expect(w.job(job, [requires]).compose()).toMatchSnapshot();
  });

  it('can take triggers', () => {
    const branches = new Branches().only('test-branch');

    const w = new Workflow('test-workflow').schedule('* * * * *', branches);

    expect(w.compose()).toMatchSnapshot();
  });

  it('can trigger based on tags', () => {
    const filter = new Filter()
      .branches({
        ignore: ['master', 'release'],
      })
      .tags({
        only: ['/v.*/'],
      });

    const w = new Workflow('test-workflow').schedule('* * * * *', filter);
    expect(w.compose()).toMatchSnapshot();
  });
});

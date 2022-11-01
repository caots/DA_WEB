import { TestBed } from '@angular/core/testing';

import { ListJobJobseekerGuard } from './list-job-jobseeker.guard';

describe('ListJobJobseekerGuard', () => {
  let guard: ListJobJobseekerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ListJobJobseekerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

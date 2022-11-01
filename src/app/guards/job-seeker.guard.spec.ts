import { TestBed } from '@angular/core/testing';

import { JobSeekerGuard } from './job-seeker.guard';

describe('JobSeekerGuard', () => {
  let guard: JobSeekerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(JobSeekerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

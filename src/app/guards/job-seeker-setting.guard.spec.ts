import { TestBed } from '@angular/core/testing';

import { JobSeekerSettingGuard } from './job-seeker-setting.guard';

describe('JobSeekerSettingGuard', () => {
  let guard: JobSeekerSettingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(JobSeekerSettingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

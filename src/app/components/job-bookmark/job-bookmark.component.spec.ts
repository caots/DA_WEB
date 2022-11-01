import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBookmarkComponent } from './job-bookmark.component';

describe('JobBookmarkComponent', () => {
  let component: JobBookmarkComponent;
  let fixture: ComponentFixture<JobBookmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobBookmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobBookmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

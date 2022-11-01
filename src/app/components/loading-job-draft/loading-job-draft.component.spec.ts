import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingJobDraftComponent } from './loading-job-draft.component';

describe('LoadingJobDraftComponent', () => {
  let component: LoadingJobDraftComponent;
  let fixture: ComponentFixture<LoadingJobDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingJobDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingJobDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingJobDetailComponent } from './loading-job-detail.component';

describe('LoadingJobDetailComponent', () => {
  let component: LoadingJobDetailComponent;
  let fixture: ComponentFixture<LoadingJobDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingJobDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingJobDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

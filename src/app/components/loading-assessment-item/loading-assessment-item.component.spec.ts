import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingAssessmentItemComponent } from './loading-assessment-item.component';

describe('LoadingAssessmentItemComponent', () => {
  let component: LoadingAssessmentItemComponent;
  let fixture: ComponentFixture<LoadingAssessmentItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingAssessmentItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingAssessmentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

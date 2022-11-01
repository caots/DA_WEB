import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeCustomeAssessmentInfoComponent } from './take-custome-assessment-info.component';

describe('TakeCustomeAssessmentInfoComponent', () => {
  let component: TakeCustomeAssessmentInfoComponent;
  let fixture: ComponentFixture<TakeCustomeAssessmentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeCustomeAssessmentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeCustomeAssessmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

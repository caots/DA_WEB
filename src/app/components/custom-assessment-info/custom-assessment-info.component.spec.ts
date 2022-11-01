import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAssessmentInfoComponent } from './custom-assessment-info.component';

describe('CustomAssessmentInfoComponent', () => {
  let component: CustomAssessmentInfoComponent;
  let fixture: ComponentFixture<CustomAssessmentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAssessmentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAssessmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

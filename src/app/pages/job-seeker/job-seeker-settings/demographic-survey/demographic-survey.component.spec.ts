import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicSurveyComponent } from './demographic-survey.component';

describe('DemographicSurveyComponent', () => {
  let component: DemographicSurveyComponent;
  let fixture: ComponentFixture<DemographicSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemographicSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemographicSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

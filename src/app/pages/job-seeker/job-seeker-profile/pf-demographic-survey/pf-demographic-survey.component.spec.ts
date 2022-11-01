import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PfDemographicSurveyComponent } from './pf-demographic-survey.component';

describe('PfDemographicSurveyComponent', () => {
  let component: PfDemographicSurveyComponent;
  let fixture: ComponentFixture<PfDemographicSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PfDemographicSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PfDemographicSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

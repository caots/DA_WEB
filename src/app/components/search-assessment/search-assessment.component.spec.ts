import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAssessmentComponent } from './search-assessment.component';

describe('SearchAssessmentComponent', () => {
  let component: SearchAssessmentComponent;
  let fixture: ComponentFixture<SearchAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

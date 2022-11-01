import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedAssessmentsComponent } from './featured-assessments.component';

describe('FeaturedAssessmentsComponent', () => {
  let component: FeaturedAssessmentsComponent;
  let fixture: ComponentFixture<FeaturedAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

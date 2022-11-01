import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAssessmentsComponent } from './custom-assessments.component';

describe('CustomAssessmentsComponent', () => {
  let component: CustomAssessmentsComponent;
  let fixture: ComponentFixture<CustomAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

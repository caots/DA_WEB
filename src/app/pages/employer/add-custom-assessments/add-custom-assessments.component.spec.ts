import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomAssessmentsComponent } from './add-custom-assessments.component';

describe('AddCustomAssessmentsComponent', () => {
  let component: AddCustomAssessmentsComponent;
  let fixture: ComponentFixture<AddCustomAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

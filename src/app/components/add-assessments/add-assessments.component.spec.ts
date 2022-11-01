import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssessmentsComponent } from './add-assessments.component';

describe('AddAssessmentsComponent', () => {
  let component: AddAssessmentsComponent;
  let fixture: ComponentFixture<AddAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsTagComponent } from './assessments-tag.component';

describe('AssessmentsTagComponent', () => {
  let component: AssessmentsTagComponent;
  let fixture: ComponentFixture<AssessmentsTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentsTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentsTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsSearchComponent } from './assessments-search.component';

describe('AssessmentsSearchComponent', () => {
  let component: AssessmentsSearchComponent;
  let fixture: ComponentFixture<AssessmentsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsCardComponent } from './assessments-card.component';

describe('AssessmentsCardComponent', () => {
  let component: AssessmentsCardComponent;
  let fixture: ComponentFixture<AssessmentsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

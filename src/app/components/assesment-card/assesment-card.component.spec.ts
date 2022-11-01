import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmentCardComponent } from './assesment-card.component';

describe('AssesmentCardComponent', () => {
  let component: AssesmentCardComponent;
  let fixture: ComponentFixture<AssesmentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssesmentCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssesmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowMeasuredskillsComparesComponent } from './how-measuredskills-compares.component';

describe('HowMeasuredskillsComparesComponent', () => {
  let component: HowMeasuredskillsComparesComponent;
  let fixture: ComponentFixture<HowMeasuredskillsComparesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowMeasuredskillsComparesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowMeasuredskillsComparesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

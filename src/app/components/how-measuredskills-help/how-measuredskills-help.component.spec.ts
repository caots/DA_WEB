import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowMeasuredskillsHelpComponent } from './how-measuredskills-help.component';

describe('HowMeasuredskillsHelpComponent', () => {
  let component: HowMeasuredskillsHelpComponent;
  let fixture: ComponentFixture<HowMeasuredskillsHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowMeasuredskillsHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowMeasuredskillsHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

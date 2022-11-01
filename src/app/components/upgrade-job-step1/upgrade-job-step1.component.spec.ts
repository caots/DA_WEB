import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeJobStep1Component } from './upgrade-job-step1.component';

describe('UpgradeJobStep1Component', () => {
  let component: UpgradeJobStep1Component;
  let fixture: ComponentFixture<UpgradeJobStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeJobStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeJobStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeJobStep0Component } from './upgrade-job-step0.component';

describe('UpgradeJobStep0Component', () => {
  let component: UpgradeJobStep0Component;
  let fixture: ComponentFixture<UpgradeJobStep0Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeJobStep0Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeJobStep0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

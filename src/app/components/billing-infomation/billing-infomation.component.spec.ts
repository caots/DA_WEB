import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingInfomationComponent } from './billing-infomation.component';

describe('BillingInfomationComponent', () => {
  let component: BillingInfomationComponent;
  let fixture: ComponentFixture<BillingInfomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingInfomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurPricingComponent } from './our-pricing.component';

describe('OurPricingComponent', () => {
  let component: OurPricingComponent;
  let fixture: ComponentFixture<OurPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBillingHistoryComponent } from './loading-billing-history.component';

describe('LoadingBillingHistoryComponent', () => {
  let component: LoadingBillingHistoryComponent;
  let fixture: ComponentFixture<LoadingBillingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBillingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBillingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

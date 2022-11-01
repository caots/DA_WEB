import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddCreditCardComponent } from './modal-add-credit-card.component';

describe('ModalAddCreditCardComponent', () => {
  let component: ModalAddCreditCardComponent;
  let fixture: ComponentFixture<ModalAddCreditCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddCreditCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStepShoppingCartComponent } from './modal-step-shopping-cart.component';

describe('ModalStepShoppingCartComponent', () => {
  let component: ModalStepShoppingCartComponent;
  let fixture: ComponentFixture<ModalStepShoppingCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalStepShoppingCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalStepShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

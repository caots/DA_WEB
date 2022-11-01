import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerfifyCodeComponent } from './modal-verfify-code.component';

describe('ModalVerfifyCodeComponent', () => {
  let component: ModalVerfifyCodeComponent;
  let fixture: ComponentFixture<ModalVerfifyCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalVerfifyCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVerfifyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

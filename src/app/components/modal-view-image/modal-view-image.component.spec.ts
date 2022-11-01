import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewImageComponent } from './modal-view-image.component';

describe('ModalViewImageComponent', () => {
  let component: ModalViewImageComponent;
  let fixture: ComponentFixture<ModalViewImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalViewImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalViewImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

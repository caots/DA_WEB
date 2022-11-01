import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPreviewFileComponent } from './modal-preview-file.component';

describe('ModalPreviewFileComponent', () => {
  let component: ModalPreviewFileComponent;
  let fixture: ComponentFixture<ModalPreviewFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPreviewFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPreviewFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

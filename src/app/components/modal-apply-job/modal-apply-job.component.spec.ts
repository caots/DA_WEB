import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApplyJobComponent } from './modal-apply-job.component';

describe('ModalApplyJobComponent', () => {
  let component: ModalApplyJobComponent;
  let fixture: ComponentFixture<ModalApplyJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalApplyJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalApplyJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

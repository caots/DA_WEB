import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddJobWithThreeStepComponent } from './modal-add-job-with-three-step.component';

describe('ModalAddJobWithThreeStepComponent', () => {
  let component: ModalAddJobWithThreeStepComponent;
  let fixture: ComponentFixture<ModalAddJobWithThreeStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddJobWithThreeStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddJobWithThreeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

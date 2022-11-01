import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTakeAssessmentsToApplyComponent } from './modal-take-assessments-to-apply.component';

describe('ModalTakeAssessmentsToApplyComponent', () => {
  let component: ModalTakeAssessmentsToApplyComponent;
  let fixture: ComponentFixture<ModalTakeAssessmentsToApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTakeAssessmentsToApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTakeAssessmentsToApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

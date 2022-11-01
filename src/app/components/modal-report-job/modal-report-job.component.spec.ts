import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReportJobComponent } from './modal-report-job.component';

describe('ModalReportJobComponent', () => {
  let component: ModalReportJobComponent;
  let fixture: ComponentFixture<ModalReportJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReportJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReportJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

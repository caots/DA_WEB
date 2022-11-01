import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReportCompanyComponent } from './modal-report-company.component';

describe('ModalReportCompanyComponent', () => {
  let component: ModalReportCompanyComponent;
  let fixture: ComponentFixture<ModalReportCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReportCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReportCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

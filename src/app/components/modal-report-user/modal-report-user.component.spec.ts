import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReportUserComponent } from './modal-report-user.component';

describe('ModalReportUserComponent', () => {
  let component: ModalReportUserComponent;
  let fixture: ComponentFixture<ModalReportUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReportUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReportUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

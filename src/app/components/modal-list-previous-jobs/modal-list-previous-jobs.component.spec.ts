import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListPreviousJobsComponent } from './modal-list-previous-jobs.component';

describe('ModalListPreviousJobsComponent', () => {
  let component: ModalListPreviousJobsComponent;
  let fixture: ComponentFixture<ModalListPreviousJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalListPreviousJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListPreviousJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpgrageJobPostingComponent } from './modal-upgrage-job-posting.component';

describe('ModalUpgrageJobPostingComponent', () => {
  let component: ModalUpgrageJobPostingComponent;
  let fixture: ComponentFixture<ModalUpgrageJobPostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUpgrageJobPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUpgrageJobPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

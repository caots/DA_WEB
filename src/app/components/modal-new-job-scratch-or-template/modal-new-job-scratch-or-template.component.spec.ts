import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewJobScratchOrTemplateComponent } from './modal-new-job-scratch-or-template.component';

describe('ModalNewJobScratchOrTemplateComponent', () => {
  let component: ModalNewJobScratchOrTemplateComponent;
  let fixture: ComponentFixture<ModalNewJobScratchOrTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewJobScratchOrTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewJobScratchOrTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewJobEmployerComponent } from './preview-job-employer.component';

describe('PreviewJobEmployerComponent', () => {
  let component: PreviewJobEmployerComponent;
  let fixture: ComponentFixture<PreviewJobEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewJobEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewJobEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

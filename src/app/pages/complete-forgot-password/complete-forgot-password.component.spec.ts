import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteForgotPasswordComponent } from './complete-forgot-password.component';

describe('CompleteForgotPasswordComponent', () => {
  let component: CompleteForgotPasswordComponent;
  let fixture: ComponentFixture<CompleteForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

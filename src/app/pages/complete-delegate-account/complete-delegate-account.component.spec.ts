import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteDelegateAccountComponent } from './complete-delegate-account.component';

describe('CompleteDelegateAccountComponent', () => {
  let component: CompleteDelegateAccountComponent;
  let fixture: ComponentFixture<CompleteDelegateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteDelegateAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteDelegateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

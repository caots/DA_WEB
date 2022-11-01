import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerFaqComponent } from './employer-faq.component';

describe('EmployerFaqComponent', () => {
  let component: EmployerFaqComponent;
  let fixture: ComponentFixture<EmployerFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

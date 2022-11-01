import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingEmployerComponent } from './landing-employer.component';

describe('LandingEmployerComponent', () => {
  let component: LandingEmployerComponent;
  let fixture: ComponentFixture<LandingEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

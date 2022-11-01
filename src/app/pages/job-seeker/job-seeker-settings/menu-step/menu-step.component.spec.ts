import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuStepComponent } from './menu-step.component';

describe('MenuStepComponent', () => {
  let component: MenuStepComponent;
  let fixture: ComponentFixture<MenuStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

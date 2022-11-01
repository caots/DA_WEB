import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStartedTodayComponent } from './get-started-today.component';

describe('GetStartedTodayComponent', () => {
  let component: GetStartedTodayComponent;
  let fixture: ComponentFixture<GetStartedTodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetStartedTodayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

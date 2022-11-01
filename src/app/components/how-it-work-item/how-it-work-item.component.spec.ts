import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorkItemComponent } from './how-it-work-item.component';

describe('HowItWorkItemComponent', () => {
  let component: HowItWorkItemComponent;
  let fixture: ComponentFixture<HowItWorkItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowItWorkItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

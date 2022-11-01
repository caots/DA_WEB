import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIconInterviewComponent } from './list-icon-interview.component';

describe('ListIconInterviewComponent', () => {
  let component: ListIconInterviewComponent;
  let fixture: ComponentFixture<ListIconInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListIconInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIconInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

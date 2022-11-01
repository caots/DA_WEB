import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCompleteComponent } from './message-complete.component';

describe('MessageCompleteComponent', () => {
  let component: MessageCompleteComponent;
  let fixture: ComponentFixture<MessageCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

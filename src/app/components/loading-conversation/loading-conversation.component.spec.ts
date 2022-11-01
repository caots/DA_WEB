import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingConversationComponent } from './loading-conversation.component';

describe('LoadingConversationComponent', () => {
  let component: LoadingConversationComponent;
  let fixture: ComponentFixture<LoadingConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

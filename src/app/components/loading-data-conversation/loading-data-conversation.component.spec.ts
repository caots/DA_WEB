import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingDataConversationComponent } from './loading-data-conversation.component';

describe('LoadingDataConversationComponent', () => {
  let component: LoadingDataConversationComponent;
  let fixture: ComponentFixture<LoadingDataConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingDataConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingDataConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

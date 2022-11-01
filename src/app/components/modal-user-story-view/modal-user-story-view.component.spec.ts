import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserStoryViewComponent } from './modal-user-story-view.component';

describe('ModalUserStoryViewComponent', () => {
  let component: ModalUserStoryViewComponent;
  let fixture: ComponentFixture<ModalUserStoryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUserStoryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserStoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

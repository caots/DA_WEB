import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStoryViewComponent } from './user-story-view.component';

describe('UserStoryViewComponent', () => {
  let component: UserStoryViewComponent;
  let fixture: ComponentFixture<UserStoryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStoryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

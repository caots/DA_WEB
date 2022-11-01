import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFindCandidateProfileComponent } from './user-find-candidate-profile.component';

describe('UserFindCandidateProfileComponent', () => {
  let component: UserFindCandidateProfileComponent;
  let fixture: ComponentFixture<UserFindCandidateProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFindCandidateProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFindCandidateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCandidateProfileComponent } from './find-candidate-profile.component';

describe('FindCandidateProfileComponent', () => {
  let component: FindCandidateProfileComponent;
  let fixture: ComponentFixture<FindCandidateProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindCandidateProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindCandidateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

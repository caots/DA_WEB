import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowEmployersComponent } from './follow-employers.component';

describe('FollowEmployersComponent', () => {
  let component: FollowEmployersComponent;
  let fixture: ComponentFixture<FollowEmployersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowEmployersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowEmployersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

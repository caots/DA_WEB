import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSayingSliderComponent } from './user-saying-slider.component';

describe('UserSayingSliderComponent', () => {
  let component: UserSayingSliderComponent;
  let fixture: ComponentFixture<UserSayingSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSayingSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSayingSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

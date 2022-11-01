import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateBotComponent } from './rate-bot.component';

describe('RateBotComponent', () => {
  let component: RateBotComponent;
  let fixture: ComponentFixture<RateBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateBotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

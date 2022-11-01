import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreqentlyAskedQuestionsComponent } from './freqently-asked-questions.component';

describe('FreqentlyAskedQuestionsComponent', () => {
  let component: FreqentlyAskedQuestionsComponent;
  let fixture: ComponentFixture<FreqentlyAskedQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreqentlyAskedQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreqentlyAskedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

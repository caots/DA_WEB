import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasuredSkillsComponent } from './measured-skills.component';

describe('MeasuredSkillsComponent', () => {
  let component: MeasuredSkillsComponent;
  let fixture: ComponentFixture<MeasuredSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasuredSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasuredSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

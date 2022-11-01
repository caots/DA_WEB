import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillWorksComponent } from './skill-works.component';

describe('SkillWorksComponent', () => {
  let component: SkillWorksComponent;
  let fixture: ComponentFixture<SkillWorksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillWorksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillRequiredBoxComponent } from './skill-required-box.component';

describe('SkillRequiredBoxComponent', () => {
  let component: SkillRequiredBoxComponent;
  let fixture: ComponentFixture<SkillRequiredBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillRequiredBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillRequiredBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

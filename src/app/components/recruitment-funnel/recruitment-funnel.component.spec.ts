import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentFunnelComponent } from './recruitment-funnel.component';

describe('RecruitmentFunnelComponent', () => {
  let component: RecruitmentFunnelComponent;
  let fixture: ComponentFixture<RecruitmentFunnelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentFunnelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentFunnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

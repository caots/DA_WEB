import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerChartComponent } from './follower-chart.component';

describe('FollowerChartComponent', () => {
  let component: FollowerChartComponent;
  let fixture: ComponentFixture<FollowerChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowerChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

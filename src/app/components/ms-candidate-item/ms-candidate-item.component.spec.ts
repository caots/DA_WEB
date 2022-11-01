import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsCandidateItemComponent } from './ms-candidate-item.component';

describe('MsCandidateItemComponent', () => {
  let component: MsCandidateItemComponent;
  let fixture: ComponentFixture<MsCandidateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsCandidateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsCandidateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

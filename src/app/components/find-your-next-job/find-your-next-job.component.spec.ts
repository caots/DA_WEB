import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindYourNextJobComponent } from './find-your-next-job.component';

describe('FindYourNextJobComponent', () => {
  let component: FindYourNextJobComponent;
  let fixture: ComponentFixture<FindYourNextJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindYourNextJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindYourNextJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

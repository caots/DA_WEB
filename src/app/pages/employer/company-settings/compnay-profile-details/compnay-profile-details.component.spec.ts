import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompnayProfileDetailsComponent } from './compnay-profile-details.component';

describe('CompnayProfileDetailsComponent', () => {
  let component: CompnayProfileDetailsComponent;
  let fixture: ComponentFixture<CompnayProfileDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompnayProfileDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompnayProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

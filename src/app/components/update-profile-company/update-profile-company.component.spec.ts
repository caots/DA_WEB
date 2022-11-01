import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileCompanyComponent } from './update-profile-company.component';

describe('UpdateProfileCompanyComponent', () => {
  let component: UpdateProfileCompanyComponent;
  let fixture: ComponentFixture<UpdateProfileCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateProfileCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProfileCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

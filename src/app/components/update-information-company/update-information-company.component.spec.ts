import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInformationCompanyComponent } from './update-information-company.component';

describe('UpdateInformationCompanyComponent', () => {
  let component: UpdateInformationCompanyComponent;
  let fixture: ComponentFixture<UpdateInformationCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateInformationCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInformationCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

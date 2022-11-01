import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPreviewInfoComponent } from './company-preview-info.component';

describe('CompanyPreviewInfoComponent', () => {
  let component: CompanyPreviewInfoComponent;
  let fixture: ComponentFixture<CompanyPreviewInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPreviewInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPreviewInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConpanySettingsComponent } from './conpany-settings.component';

describe('ConpanySettingsComponent', () => {
  let component: ConpanySettingsComponent;
  let fixture: ComponentFixture<ConpanySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConpanySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConpanySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

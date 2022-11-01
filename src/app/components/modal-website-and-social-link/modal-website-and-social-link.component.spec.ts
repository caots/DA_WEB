import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWebsiteAndSocialLinkComponent } from './modal-website-and-social-link.component';

describe('ModalWebsiteAndSocialLinkComponent', () => {
  let component: ModalWebsiteAndSocialLinkComponent;
  let fixture: ComponentFixture<ModalWebsiteAndSocialLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalWebsiteAndSocialLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWebsiteAndSocialLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

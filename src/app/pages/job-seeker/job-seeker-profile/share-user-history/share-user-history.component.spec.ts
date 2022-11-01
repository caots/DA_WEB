import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareUserHistoryComponent } from './share-user-history.component';

describe('ShareUserHistoryComponent', () => {
  let component: ShareUserHistoryComponent;
  let fixture: ComponentFixture<ShareUserHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareUserHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareUserHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalShareUserHistoryComponent } from './modal-share-user-history.component';

describe('ModalShareUserHistoryComponent', () => {
  let component: ModalShareUserHistoryComponent;
  let fixture: ComponentFixture<ModalShareUserHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalShareUserHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalShareUserHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

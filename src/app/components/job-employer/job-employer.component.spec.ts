import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobEmployerComponent } from './job-employer.component';

describe('JobEmployerComponent', () => {
  let component: JobEmployerComponent;
  let fixture: ComponentFixture<JobEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailConsultationComponent } from './detail-consultation.component';

describe('DetailConsultationComponentComponent', () => {
  let component: DetailConsultationComponent;
  let fixture: ComponentFixture<DetailConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

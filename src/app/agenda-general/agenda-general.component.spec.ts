import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaGeneralComponent } from './agenda-general.component';

describe('AgendaGeneralComponent', () => {
  let component: AgendaGeneralComponent;
  let fixture: ComponentFixture<AgendaGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

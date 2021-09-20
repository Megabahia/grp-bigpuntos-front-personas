import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCalificacionesComponent } from './mis-calificaciones.component';

describe('MisCalificacionesComponent', () => {
  let component: MisCalificacionesComponent;
  let fixture: ComponentFixture<MisCalificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisCalificacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisCalificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

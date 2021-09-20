import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartirPublicacionesComponent } from './compartir-publicaciones.component';

describe('CompartirPublicacionesComponent', () => {
  let component: CompartirPublicacionesComponent;
  let fixture: ComponentFixture<CompartirPublicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompartirPublicacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompartirPublicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

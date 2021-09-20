import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FelicidadesRegistroComponent } from './felicidades-registro.component';

describe('FelicidadesRegistroComponent', () => {
  let component: FelicidadesRegistroComponent;
  let fixture: ComponentFixture<FelicidadesRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FelicidadesRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FelicidadesRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

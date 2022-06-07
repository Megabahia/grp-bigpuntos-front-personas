import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamosRequerimientosComponent } from './reclamos-requerimientos.component';

describe('ReclamosRequerimientosComponent', () => {
  let component: ReclamosRequerimientosComponent;
  let fixture: ComponentFixture<ReclamosRequerimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReclamosRequerimientosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclamosRequerimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

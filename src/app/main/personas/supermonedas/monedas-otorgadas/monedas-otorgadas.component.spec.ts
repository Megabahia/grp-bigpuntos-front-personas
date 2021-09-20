import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonedasOtorgadasComponent } from './monedas-otorgadas.component';

describe('MonedasOtorgadasComponent', () => {
  let component: MonedasOtorgadasComponent;
  let fixture: ComponentFixture<MonedasOtorgadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonedasOtorgadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonedasOtorgadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

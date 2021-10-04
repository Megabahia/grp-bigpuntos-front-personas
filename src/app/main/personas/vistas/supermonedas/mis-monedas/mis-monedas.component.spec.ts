import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisMonedasComponent } from './mis-monedas.component';

describe('MisMonedasComponent', () => {
  let component: MisMonedasComponent;
  let fixture: ComponentFixture<MisMonedasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisMonedasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisMonedasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

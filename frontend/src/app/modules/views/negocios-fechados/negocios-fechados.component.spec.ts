import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegociosFechadosComponent } from './negocios-fechados.component';

describe('NegociosFechadosComponent', () => {
  let component: NegociosFechadosComponent;
  let fixture: ComponentFixture<NegociosFechadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NegociosFechadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NegociosFechadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropostasComponent } from './propostas.component';

describe('PropostasComponent', () => {
  let component: PropostasComponent;
  let fixture: ComponentFixture<PropostasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropostasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropostasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

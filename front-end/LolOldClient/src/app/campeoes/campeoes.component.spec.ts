import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampeoesComponent } from './campeoes.component';

describe('CampeoesComponent', () => {
  let component: CampeoesComponent;
  let fixture: ComponentFixture<CampeoesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampeoesComponent]
    });
    fixture = TestBed.createComponent(CampeoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

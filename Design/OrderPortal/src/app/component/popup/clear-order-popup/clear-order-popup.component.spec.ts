import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearOrderPopupComponent } from './clear-order-popup.component';

describe('ClearOrderPopupComponent', () => {
  let component: ClearOrderPopupComponent;
  let fixture: ComponentFixture<ClearOrderPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClearOrderPopupComponent]
    });
    fixture = TestBed.createComponent(ClearOrderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

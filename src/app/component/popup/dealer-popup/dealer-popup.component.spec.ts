import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerPopupComponent } from './dealer-popup.component';

describe('DealerPopupComponent', () => {
  let component: DealerPopupComponent;
  let fixture: ComponentFixture<DealerPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealerPopupComponent]
    });
    fixture = TestBed.createComponent(DealerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

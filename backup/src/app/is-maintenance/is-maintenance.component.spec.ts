import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsMaintenanceComponent } from './is-maintenance.component';

describe('IsMaintenanceComponent', () => {
  let component: IsMaintenanceComponent;
  let fixture: ComponentFixture<IsMaintenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IsMaintenanceComponent]
    });
    fixture = TestBed.createComponent(IsMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

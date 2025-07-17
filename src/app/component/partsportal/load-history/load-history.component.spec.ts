import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadHistoryComponent } from './load-history.component';

describe('LoadHistoryComponent', () => {
  let component: LoadHistoryComponent;
  let fixture: ComponentFixture<LoadHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadHistoryComponent]
    });
    fixture = TestBed.createComponent(LoadHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearconfirmationComponent } from './clearconfirmation.component';

describe('ClearconfirmationComponent', () => {
  let component: ClearconfirmationComponent;
  let fixture: ComponentFixture<ClearconfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClearconfirmationComponent]
    });
    fixture = TestBed.createComponent(ClearconfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

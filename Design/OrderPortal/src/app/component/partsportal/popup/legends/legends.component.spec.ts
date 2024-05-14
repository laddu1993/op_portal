import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendsComponent } from './legends.component';

describe('LegendsComponent', () => {
  let component: LegendsComponent;
  let fixture: ComponentFixture<LegendsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegendsComponent]
    });
    fixture = TestBed.createComponent(LegendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralOutputComponent } from './general-output.component';

describe('GeneralOutputComponent', () => {
  let component: GeneralOutputComponent;
  let fixture: ComponentFixture<GeneralOutputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralOutputComponent]
    });
    fixture = TestBed.createComponent(GeneralOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

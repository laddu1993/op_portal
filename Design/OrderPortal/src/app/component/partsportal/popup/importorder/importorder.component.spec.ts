import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportorderComponent } from './importorder.component';

describe('ImportorderComponent', () => {
  let component: ImportorderComponent;
  let fixture: ComponentFixture<ImportorderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportorderComponent]
    });
    fixture = TestBed.createComponent(ImportorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

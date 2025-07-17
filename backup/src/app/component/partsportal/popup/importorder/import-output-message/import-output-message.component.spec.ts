import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOutputMessageComponent } from './import-output-message.component';

describe('ImportOutputMessageComponent', () => {
  let component: ImportOutputMessageComponent;
  let fixture: ComponentFixture<ImportOutputMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportOutputMessageComponent]
    });
    fixture = TestBed.createComponent(ImportOutputMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

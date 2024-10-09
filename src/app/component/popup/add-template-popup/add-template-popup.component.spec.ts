import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTemplatePopupComponent } from './add-template-popup.component';

describe('AddTemplatePopupComponent', () => {
  let component: AddTemplatePopupComponent;
  let fixture: ComponentFixture<AddTemplatePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTemplatePopupComponent]
    });
    fixture = TestBed.createComponent(AddTemplatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

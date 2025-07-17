import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePopupComponent } from './template-popup.component';

describe('TemplatePopupComponent', () => {
  let component: TemplatePopupComponent;
  let fixture: ComponentFixture<TemplatePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatePopupComponent]
    });
    fixture = TestBed.createComponent(TemplatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTemplatePopupComponent } from './delete-template-popup.component';

describe('DeleteTemplatePopupComponent', () => {
  let component: DeleteTemplatePopupComponent;
  let fixture: ComponentFixture<DeleteTemplatePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteTemplatePopupComponent]
    });
    fixture = TestBed.createComponent(DeleteTemplatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitOutputMessageComponent } from './submit-output-message.component';

describe('SubmitOutputMessageComponent', () => {
  let component: SubmitOutputMessageComponent;
  let fixture: ComponentFixture<SubmitOutputMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitOutputMessageComponent]
    });
    fixture = TestBed.createComponent(SubmitOutputMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInfoComponent } from './header-info.component';

describe('HeaderInfoComponent', () => {
  let component: HeaderInfoComponent;
  let fixture: ComponentFixture<HeaderInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderInfoComponent]
    });
    fixture = TestBed.createComponent(HeaderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

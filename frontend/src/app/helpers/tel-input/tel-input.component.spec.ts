import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelInputComponent } from './tel-input.component';

describe('TelInputComponent', () => {
  let component: TelInputComponent;
  let fixture: ComponentFixture<TelInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

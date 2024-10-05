import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BowlingInputPage } from './bowling-input.page';

describe('BowlingInputPage', () => {
  let component: BowlingInputPage;
  let fixture: ComponentFixture<BowlingInputPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BowlingInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

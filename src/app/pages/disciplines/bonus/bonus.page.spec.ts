import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonusPage } from './bonus.page';

describe('BonusPage', () => {
  let component: BonusPage;
  let fixture: ComponentFixture<BonusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

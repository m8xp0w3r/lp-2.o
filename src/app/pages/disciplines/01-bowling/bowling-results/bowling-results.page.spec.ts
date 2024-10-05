import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BowlingResultsPage } from './bowling-results.page';

describe('BowlingResultsPage', () => {
  let component: BowlingResultsPage;
  let fixture: ComponentFixture<BowlingResultsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BowlingResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

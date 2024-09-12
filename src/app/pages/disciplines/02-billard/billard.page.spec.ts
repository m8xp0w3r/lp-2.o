import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillardPage } from './billard.page';

describe('BillardPage', () => {
  let component: BillardPage;
  let fixture: ComponentFixture<BillardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BillardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

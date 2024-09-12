import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanschSelectionPage } from './pansch-selection.page';

describe('PanschSelectionPage', () => {
  let component: PanschSelectionPage;
  let fixture: ComponentFixture<PanschSelectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanschSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanschAdministrationPage } from './pansch-administration.page';

describe('PanschAdministrationPage', () => {
  let component: PanschAdministrationPage;
  let fixture: ComponentFixture<PanschAdministrationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanschAdministrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

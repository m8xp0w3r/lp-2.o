import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AirHockeyPage } from './air-hockey.page';

describe('AirHockeyPage', () => {
  let component: AirHockeyPage;
  let fixture: ComponentFixture<AirHockeyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AirHockeyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

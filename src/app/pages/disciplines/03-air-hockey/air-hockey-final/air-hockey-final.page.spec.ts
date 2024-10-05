import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AirHockeyFinalPage } from './air-hockey-final.page';

describe('AirHockeyFinalPage', () => {
  let component: AirHockeyFinalPage;
  let fixture: ComponentFixture<AirHockeyFinalPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(AirHockeyFinalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

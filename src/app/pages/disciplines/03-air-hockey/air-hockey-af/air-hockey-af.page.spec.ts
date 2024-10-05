import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AirHockeyAfPage } from './air-hockey-af.page';

describe('AirHockeyAfPage', () => {
  let component: AirHockeyAfPage;
  let fixture: ComponentFixture<AirHockeyAfPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(AirHockeyAfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

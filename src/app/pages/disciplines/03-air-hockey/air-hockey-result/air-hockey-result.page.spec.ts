import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AirHockeyResultPage } from './air-hockey-result.page';

describe('AirHockeyResultPage', () => {
  let component: AirHockeyResultPage;
  let fixture: ComponentFixture<AirHockeyResultPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(AirHockeyResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

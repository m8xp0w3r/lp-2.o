import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AirHockeyHfPage } from './air-hockey-hf.page';

describe('AirHockeyHfPage', () => {
  let component: AirHockeyHfPage;
  let fixture: ComponentFixture<AirHockeyHfPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(AirHockeyHfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

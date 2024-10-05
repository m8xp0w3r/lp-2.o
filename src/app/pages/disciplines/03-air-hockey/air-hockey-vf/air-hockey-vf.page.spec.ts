import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AirHockeyVfPage } from './air-hockey-vf.page';

describe('AirHockeyVfPage', () => {
  let component: AirHockeyVfPage;
  let fixture: ComponentFixture<AirHockeyVfPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(AirHockeyVfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

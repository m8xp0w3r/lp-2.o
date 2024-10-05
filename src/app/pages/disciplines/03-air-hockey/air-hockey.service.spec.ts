import { TestBed } from '@angular/core/testing';

import { AirHockeyService } from './air-hockey.service';

describe('AirHockeyService', () => {
  let service: AirHockeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirHockeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

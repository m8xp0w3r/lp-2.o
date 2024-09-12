import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DoubleTeamItemComponent } from './double-team-item.component';

describe('DoubleTeamItemComponent', () => {
  let component: DoubleTeamItemComponent;
  let fixture: ComponentFixture<DoubleTeamItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DoubleTeamItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoubleTeamItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

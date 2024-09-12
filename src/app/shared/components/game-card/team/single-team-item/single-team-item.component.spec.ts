import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleTeamItemComponent } from './single-team-item.component';

describe('SingleTeamItemComponent', () => {
  let component: SingleTeamItemComponent;
  let fixture: ComponentFixture<SingleTeamItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SingleTeamItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleTeamItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

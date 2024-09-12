import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSelectionPage } from './user-selection.page';

describe('UserSelectionPage', () => {
  let component: UserSelectionPage;
  let fixture: ComponentFixture<UserSelectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

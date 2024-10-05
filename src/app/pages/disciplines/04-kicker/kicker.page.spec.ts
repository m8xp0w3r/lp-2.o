import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KickerPage } from './kicker.page';

describe('KickerPage', () => {
  let component: KickerPage;
  let fixture: ComponentFixture<KickerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

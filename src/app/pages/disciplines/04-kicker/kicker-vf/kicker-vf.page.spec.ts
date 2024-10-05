import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { KickerVfPage } from './kicker-vf.page';

describe('KickerVfPage', () => {
  let component: KickerVfPage;
  let fixture: ComponentFixture<KickerVfPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(KickerVfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

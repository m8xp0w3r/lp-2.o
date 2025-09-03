import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PanschWaitingComponent } from '@components';

describe('PanschWaitingComponent', () => {
  let component: PanschWaitingComponent;
  let fixture: ComponentFixture<PanschWaitingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), PanschWaitingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PanschWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

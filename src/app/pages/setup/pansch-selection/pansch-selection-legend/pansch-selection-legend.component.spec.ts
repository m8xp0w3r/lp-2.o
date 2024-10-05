import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PanschSelectionLegendComponent } from './pansch-selection-legend.component';

describe('PanschSelectionLegendComponent', () => {
  let component: PanschSelectionLegendComponent;
  let fixture: ComponentFixture<PanschSelectionLegendComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), PanschSelectionLegendComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PanschSelectionLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

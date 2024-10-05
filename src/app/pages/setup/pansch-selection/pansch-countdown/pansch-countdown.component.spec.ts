import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PanschCountdownComponent } from './pansch-countdown.component';

describe('PanschCountdownComponent', () => {
    let component: PanschCountdownComponent;
    let fixture: ComponentFixture<PanschCountdownComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), PanschCountdownComponent]
}).compileComponents();

        fixture = TestBed.createComponent(PanschCountdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

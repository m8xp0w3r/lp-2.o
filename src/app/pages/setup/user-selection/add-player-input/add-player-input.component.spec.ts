import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddPlayerInputComponent } from './add-player-input.component';

describe('AddPlayerInputComponent', () => {
    let component: AddPlayerInputComponent;
    let fixture: ComponentFixture<AddPlayerInputComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), AddPlayerInputComponent]
}).compileComponents();

        fixture = TestBed.createComponent(AddPlayerInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

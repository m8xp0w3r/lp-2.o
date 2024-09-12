import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserSelectionFooterComponent } from './user-selection-footer.component';

describe('UserSelectionFooterComponent', () => {
    let component: UserSelectionFooterComponent;
    let fixture: ComponentFixture<UserSelectionFooterComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), UserSelectionFooterComponent]
}).compileComponents();

        fixture = TestBed.createComponent(UserSelectionFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

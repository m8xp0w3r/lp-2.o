import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "@components";
import { LatschiPanschService } from "@services";
import { LatschiPansch } from "@interfaces";
import { IonContent, IonImg } from "@ionic/angular/standalone";


@Component({
    selector: 'lp-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    imports: [
        HeaderComponent,
        IonContent,
        IonImg
    ]
})
export class HomePage implements OnInit {
    private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
    public title = signal("Latschi Pansch");

    constructor() {
    }

    async ngOnInit() {
        const pansch: LatschiPansch | undefined = await this.latschiPanschService.getPansch();
        if (pansch) {
            this.title.set(`Latschi Pansch Vol. ${ pansch.edition }`);
        }
    }

}

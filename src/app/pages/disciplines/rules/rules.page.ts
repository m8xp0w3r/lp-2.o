import { Component, inject } from '@angular/core';
import { RulesService } from "@pages/disciplines/rules/rules.service";

import { NgFor, AsyncPipe } from '@angular/common';
import { HeaderComponent } from "@components";
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent
} from "@ionic/angular/standalone";

@Component({
    selector: 'lp-rules',
    templateUrl: './rules.page.html',
    styleUrls: ['./rules.page.scss'],
    standalone: true,
    imports: [
        HeaderComponent,
        NgFor,
        AsyncPipe,
        IonContent,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonCardContent
    ],
})
export class RulesPage {
    private rulesService: RulesService = inject(RulesService);
    public rules$ = this.rulesService.rules$;
}

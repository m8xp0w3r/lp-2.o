import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IonProgressBar } from "@ionic/angular/standalone";

@Component({
    selector: 'lp-pansch-waiting',
    templateUrl: './pansch-waiting.component.html',
    imports: [CommonModule, IonProgressBar],
    styleUrls: ['./pansch-waiting.component.scss']
})
export class PanschWaitingComponent {

}

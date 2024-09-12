import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'lp-air-hockey',
  templateUrl: './air-hockey.page.html',
  styleUrls: ['./air-hockey.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AirHockeyPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

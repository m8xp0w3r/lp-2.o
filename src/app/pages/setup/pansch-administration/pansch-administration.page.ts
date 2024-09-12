import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'lp-pansch-administration',
  templateUrl: './pansch-administration.page.html',
  styleUrls: ['./pansch-administration.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PanschAdministrationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

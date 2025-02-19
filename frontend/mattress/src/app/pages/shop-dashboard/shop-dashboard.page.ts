import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-shop-dashboard',
  templateUrl: './shop-dashboard.page.html',
  styleUrls: ['./shop-dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ShopDashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

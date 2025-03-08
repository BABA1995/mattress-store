import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor() {}

  async ngOnInit() {
    await this.requestPermissions();
  }

async  requestPermissions() {
  if (this.isWeb()) {
    console.log("Web environment detected, using navigator.geolocation");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Web Geolocation success:", position);
      },
      (error) => {
        console.error("Web Geolocation error:", error);
      }
    );
  } else {
    try {
      const permission = await Geolocation.requestPermissions();
      console.log("Capacitor Location Permission:", permission);
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  }
}

// Function to check if running on web
isWeb(): boolean {
  return !(
    navigator.userAgent.includes("Android") ||
    navigator.userAgent.includes("iPhone") ||
    navigator.userAgent.includes("iPad")
  );
}




    
    
}

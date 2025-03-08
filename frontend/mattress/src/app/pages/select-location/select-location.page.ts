import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.page.html',
  styleUrls: ['./select-location.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, CommonModule, FormsModule]
})
export class SelectLocationPage implements OnInit, AfterViewInit {
  map!: google.maps.Map;
  marker!: google.maps.marker.AdvancedMarkerElement;
  autocomplete!: google.maps.places.Autocomplete;

  constructor(private router: Router, private http: HttpClient) {}

  async ngOnInit() {
    // Ensure Google Maps is loaded before proceeding
    if (!google || !google.maps) {
      console.error('Google Maps API not loaded.');
      return;
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  async initMap(): Promise<void> {
    const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // Default: Delhi

    try {
      // Load required Google Maps libraries
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      // Initialize the map
      this.map = new Map(document.getElementById('map') as HTMLElement, {
        center: defaultLocation,
        zoom: 12
      });

      // Initialize the marker
      this.marker = new AdvancedMarkerElement({
        position: defaultLocation,
        map: this.map
      });

    } catch (error) {
      console.error('Error loading Google Maps libraries:', error);
    }
  }
}

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ShopService } from '../../../services/shop.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon, IonSearchbar, IonList } from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';

declare var google: any;

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.page.html',
  styleUrls: ['./create-shop.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon, IonSearchbar, IonList, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CreateShopPage implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  shopForm: FormGroup;
  latitude: number | null = null;
  longitude: number | null = null;
  map: any;
  marker: any;
  searchResults: any[] = [];

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.shopForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      searchQuery: '',
      location: ['', Validators.required] 
    });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['address']) {
        console.log('Selected Address:', params['address']);
        // Store the address in a variable to display in the UI
      }
    });
  }

  async ngAfterViewInit() {
    // await this.loadMap();
  }

  async loadMap() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.initMap(this.latitude, this.longitude);
    } catch (error) {
      console.error('Error loading map:', error);
    }
  }

  initMap(lat: number, lon: number) {
    this.map = L.map('map').setView([lat, lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([lat, lon], { draggable: true }).addTo(this.map);
    
    this.marker.on('dragend', () => {
      const latlng = this.marker.getLatLng();
      this.latitude = latlng.lat;
      this.longitude = latlng.lng;
      if(this.latitude !== null && this.longitude !== null){
        this.getAddressFromCoords(this.latitude, this.longitude);
      }
    });
    
    this.getAddressFromCoords(lat, lon);
  }

  searchLocation() {
    const query = this.shopForm.value.searchQuery;
    if (!query) return;
    
    this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .subscribe((data: any) => {
        this.searchResults = data;
      });
  }

  selectLocation(result: any) {
    this.latitude = parseFloat(result.lat);
    this.longitude = parseFloat(result.lon);
    this.shopForm.patchValue({
      address: result.display_name,
      location: `${this.latitude}, ${this.longitude}`
    });
    this.map.setView([this.latitude, this.longitude], 15);
    this.marker.setLatLng([this.latitude, this.longitude]);
    this.searchResults = []; // Hide search results after selection
  }

  openSelectLocation() {
    this.router.navigate(['/select-location']);
  }

  // async detectLocation() {
  //   try {
  //     const position = await Geolocation.getCurrentPosition();
  //     this.latitude = position.coords.latitude;
  //     this.longitude = position.coords.longitude;
  //     this.marker.setLatLng([this.latitude, this.longitude]);
  //     this.map.panTo([this.latitude, this.longitude]);
  //     this.getAddressFromCoords(this.latitude, this.longitude);
  //   } catch (error) {
  //     console.error('Error getting location', error);
  //     this.showToast('Failed to fetch location!', 'danger');
  //   }
  // }


  
  getAddressFromCoords(lat: number, lon: number) {
    this.http.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      .subscribe((data: any) => {
        if (data && data.display_name) {
          this.shopForm.patchValue({
            address: data.display_name,
            location: `${lat}, ${lon}`
          });
        }
      });
  }


  async useCurrentLocation() {
    const position = await Geolocation.getCurrentPosition();
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const reverseUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    
    this.http.get(reverseUrl).subscribe((data: any) => {
      this.shopForm.value.searchQuery = data.display_name;
    });
  }


  async createShop() {
    if (this.shopForm.valid && this.latitude !== null && this.longitude !== null) {
      const shopData = {
        name: this.shopForm.value.name,
        description: this.shopForm.value.description,
        address: this.shopForm.value.address,
        phone: this.shopForm.value.phone,
        location: {
          type: 'Point',
          coordinates: [this.longitude, this.latitude] 
        }
      };

      try {
        const response = await this.shopService.createShop(shopData);
        response.subscribe({
          next: async () => {
            await this.showToast('Shop created successfully!', 'success');
            this.router.navigate(['/shop-owner-dashboard']);
          },
          error: async () => {
            await this.showToast('Failed to create shop!', 'danger');
          }
        });
      } catch (error) {
        await this.showToast('An error occurred!', 'danger');
      }
    } else {
      await this.showToast('Please fill all fields and detect location!', 'warning');
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }
}

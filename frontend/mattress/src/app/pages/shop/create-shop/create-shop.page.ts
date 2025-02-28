import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ShopService } from '../../../services/shop.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.page.html',
  styleUrls: ['./create-shop.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CreateShopPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  shopForm: FormGroup;
  latitude: number | null = null;
  longitude: number | null = null;
  map: any;
  marker: any;

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router,
    private http: HttpClient
  ) {
    this.shopForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      location: ['', Validators.required] // This will store the actual address
    });
  }

  async ngOnInit() {
    await this.loadMap();
  }

  async loadMap() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      const latLng = new google.maps.LatLng(this.latitude, this.longitude);
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        draggable: true
      });

      // Update location on marker drag
      google.maps.event.addListener(this.marker, 'dragend', () => {
        const position = this.marker.getPosition();
        if (position) {
          this.latitude = position.lat();
          this.longitude = position.lng();
          
          if (this.latitude !== null && this.longitude !== null) {
            this.getAddressFromCoords(this.latitude, this.longitude);
          }
        }
      });

      // Get address from coordinates
      this.getAddressFromCoords(this.latitude, this.longitude);
    } catch (error) {
      console.error('Error loading map:', error);
      this.showToast('Failed to load map!', 'danger');
    }
  }

  async detectLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      const latLng = new google.maps.LatLng(this.latitude, this.longitude);
      this.marker.setPosition(latLng);
      this.map.panTo(latLng);

      this.getAddressFromCoords(this.latitude, this.longitude);
    } catch (error) {
      console.error('Error getting location', error);
      this.showToast('Failed to fetch location!', 'danger');
    }
  }

  getAddressFromCoords(lat: number, lng: number) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    this.http.get<any>(geocodeUrl).subscribe(
      (res: any) => {
        if (res && res.display_name) {
          this.shopForm.patchValue({ location: res.display_name });
        }
      },
      (error: any) => {
        console.error('Error fetching address:', error);
        this.showToast('Failed to fetch address!', 'danger');
      }
    );
  }

  async createShop() {
    if (this.shopForm.valid && this.latitude !== null && this.longitude !== null) {
      const userId = this.authService.getUserId();
      const shopData = {
        name: this.shopForm.value.name,
        description: this.shopForm.value.description,
        address: this.shopForm.value.address,
        phone: this.shopForm.value.phone,
        location: {
          type: 'Point',
          coordinates: [this.longitude, this.latitude] // MongoDB expects [lng, lat]
        }
      };

      try {
        const response = await this.shopService.createShop(shopData);
        response.subscribe({
          next: async (res) => {
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

import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ShopService } from '../../../services/shop.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.page.html',
  styleUrls: ['./create-shop.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonButton, CommonModule, FormsModule]
})
export class CreateShopPage implements OnInit {
  shopForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.shopForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  async createShop() {
    if (this.shopForm.valid) {
      const userId = this.authService.getUserId();
      const shopData = { ...this.shopForm.value, owner: userId };

      this.shopService.createShop(shopData).subscribe({
        next: async (res) => {
          const toast = await this.toastCtrl.create({
            message: 'Shop created successfully!',
            duration: 2000,
            color: 'success'
          });
          await toast.present();
          this.router.navigate(['/products']); // Redirect to products
        },
        error: async () => {
          const toast = await this.toastCtrl.create({
            message: 'Failed to create shop!',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      });
    }
  }


  ngOnInit() {
  }

}

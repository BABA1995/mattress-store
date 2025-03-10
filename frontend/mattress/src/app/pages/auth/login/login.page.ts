import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ShopService } from '../../../services/shop.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButton, IonIcon, IonItem, IonInput, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButton, IonIcon, IonItem, IonInput, IonLabel, RouterModule]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router,  private shopService: ShopService) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }
  
    const credentials = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.token) {
          this.authService.saveToken(response.token);
          localStorage.setItem('userRole', response.user.role); // Store role
          localStorage.setItem('userId', response.user.id); // Store user ID
  
          if (response.user.role === 'shop_owner') {
            // Check if the shop exists for this owner
            this.shopService.getShopByOwner(response.user.id).subscribe({
              next: (shop) => {
                if (!shop) {
                  this.router.navigate(['/create-shop']); // Navigate to create shop page
                } else {
                  this.router.navigate(['/shop-owner/tabs']); // Navigate to shop owner dashboard
                }
              },
              error: (err) => {
                console.error('Error fetching shop:', err);
                this.errorMessage = 'Error retrieving shop details. Please try again.';
              }
            });
          } else {
            this.router.navigate(['/customer-dashboard']); // Navigate to customer dashboard
          }
        } else {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = err.error?.message || 'Login failed. Try again.';
      }
    });
  }
  

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  forgotPassword() {
    console.log('Navigate to forgot password page');
    // Implement navigation to forgot password page
  }

  navigateToSignup(event: Event) {
    event.preventDefault();
    this.router.navigate(['/signup']);
  }

  ngOnInit() {
  }

}

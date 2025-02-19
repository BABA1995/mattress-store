import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButton, IonIcon, IonItem, IonInput, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButton, IonIcon, IonItem, IonInput, IonLabel],
})
export class HomePage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  constructor() {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    console.log('Logging in with:', this.email, this.password);
    // Implement authentication logic here
  }

  forgotPassword() {
    console.log('Navigate to forgot password page');
    // Implement navigation to forgot password page
  }

  goToSignup() {
    console.log('Navigate to forgot password page');
    // this.router.navigate(['/signup']);
  }

}

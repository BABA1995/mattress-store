import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonInput, IonItem, IonButton, IonSelect, IonSelectOption, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonInput, IonItem, IonButton, IonSelect, IonSelectOption, IonHeader, IonToolbar, IonTitle, RouterModule ]
})
export class SignupPage implements OnInit {

  user = {
    name: '',
    email: '',
    password: '',
    role: '' // customer or shop-owner
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
  }

  register() {
    this.authService.signup(this.user).subscribe(
      (res) => {
        alert('Signup successful!');
        this.router.navigate(['/login']);
      },
      (err) => {
        alert('Signup failed: ' + err.error.message);
      }
    );
  }

}

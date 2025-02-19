import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonLabel, IonInput, IonItem, IonButton, IonSelect, IonSelectOption, IonHeader} from '@ionic/angular/standalone';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [IonContent, CommonModule, FormsModule, IonInput, IonItem, IonButton, IonSelect, IonSelectOption, IonLabel, IonHeader, RouterModule ]
})
export class SignupPage implements OnInit {

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword:'',
    role: '' // customer or shop-owner
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register() {
    if (this.user.password !== this.user.confirmPassword) {
      console.log("Passwords don't match!");
      return;
    }
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { IonContent, IonHeader, IonTitle, IonToolbar,  IonButton, IonButtons, IonIcon, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonItem, IonInput, IonLabel, CommonModule, FormsModule]
})
export class AddProductPage implements OnInit {

  product = {
    name: '',
    price: null,
    description: '',
    imageUrl: ''
  };

  constructor(private productService: ProductService, private router: Router) {}

  submitProduct() {
    if (!this.product.name || !this.product.price) {
      alert('Product Name and Price are required.');
      return;
    }

    this.productService.addProduct(this.product).subscribe(() => {
      alert('Product added successfully!');
      this.router.navigate(['/products']);
    });
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  ngOnInit() {
  }

}

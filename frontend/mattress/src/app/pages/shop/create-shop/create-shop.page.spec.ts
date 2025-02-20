import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateShopPage } from './create-shop.page';

describe('CreateShopPage', () => {
  let component: CreateShopPage;
  let fixture: ComponentFixture<CreateShopPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

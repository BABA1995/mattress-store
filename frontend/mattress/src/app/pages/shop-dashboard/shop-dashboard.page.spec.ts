import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopDashboardPage } from './shop-dashboard.page';

describe('ShopDashboardPage', () => {
  let component: ShopDashboardPage;
  let fixture: ComponentFixture<ShopDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

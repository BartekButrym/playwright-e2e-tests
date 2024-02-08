import { test } from '@playwright/test';
import { v4 as uuid } from 'uuid';
import { deliveryDetails } from '../data/deliveryDetails';
import { paymentDetails } from '../data/paymentDetails';
import { ProductsPage } from '../page-objects/ProductsPage';
import { Navigation } from '../page-objects/Navigation';
import { Checkout } from '../page-objects/Checkout';
import { LoginPage } from '../page-objects/LoginPage';
import { RegisterPage } from '../page-objects/RegisterPage';
import { DeliveryDetails } from '../page-objects/DeliveryDetails';
import { PaymentPage } from '../page-objects/PaymentPage';

test('New user full end-to-end test journey', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  await productsPage.visit();
  await productsPage.sortByCheapest();

  await productsPage.addProductToBasket(0);
  await productsPage.addProductToBasket(1);
  await productsPage.addProductToBasket(2);

  const navigation = new Navigation(page);
  await navigation.goToCheckout();

  const checkout = new Checkout(page);
  await checkout.removeCheapestProduct();

  await checkout.continueToCheckout();

  const login = new LoginPage(page);
  await login.moveToSignup();

  const registerPage = new RegisterPage(page);
  const email = uuid() + '@mail.com';
  const password = uuid();
  registerPage.signUpAsNewUser(email, password);

  const deliveryDetailsPage = new DeliveryDetails(page);
  await deliveryDetailsPage.fillDetails(deliveryDetails);
  await deliveryDetailsPage.saveDetails();
  await deliveryDetailsPage.continueToPayment();

  const paymentPage = new PaymentPage(page);
  await paymentPage.activateDiscount();
  await paymentPage.fillPaymentDetails(paymentDetails);
  await paymentPage.completePayment();
});
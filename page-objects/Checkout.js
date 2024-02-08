import { expect } from '@playwright/test';

export class Checkout {
  constructor(page) {
    this.page = page;

    this.basketCards = page.locator('[data-qa="basket-card"]');
    this.basketItemPrice = page.locator('[data-qa="basket-item-price"]');
    this.basketItemRemoveButton = page.locator('[data-qa="basket-card-remove-item"]');
    this.continueToCheckoutButton = page.locator('[data-qa="continue-to-checkout"]');
  }

  removeCheapestProduct = async () => {
    await this.basketCards.first().waitFor();
    await this.basketItemPrice.first().waitFor();

    const itemsBeforeRemoval = await this.basketCards.count();

    const allPriceTexts = await this.basketItemPrice.allInnerTexts();
    const asNumbers = allPriceTexts.map(price => {
      const withoutDollarSign = price.replace('$', '');
      return parseInt(withoutDollarSign, 10);
    });

    const lowestPrice = Math.min(...asNumbers);
    const lowestPriceIndex = asNumbers.indexOf(lowestPrice);
    const specificRemoveButton = this.basketItemRemoveButton.nth(lowestPriceIndex);
    await specificRemoveButton.waitFor();
    await specificRemoveButton.click();
    await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1);
  };

  continueToCheckout = async () => {
    await this.continueToCheckoutButton.waitFor();
    await this.continueToCheckoutButton.click();
    await this.page.waitForURL(/\/login/, { timeout: 3000 });
  };
}
import { Cart, CartItem } from '../models';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: any): number {
  return cart.items
    ? cart.items.reduce(
        (acc: number, { product: { price }, count }: CartItem) => {
          return (acc += price * count);
        },
        0,
      )
    : 0;
}

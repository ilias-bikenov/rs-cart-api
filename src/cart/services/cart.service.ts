import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart } from '../models';
import { Client } from 'pg';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<Cart> {
    const client = new Client({
      user: process.env.RDS_USER,
      host: process.env.RDS_HOST,
      database: process.env.RDS_DB,
      password: process.env.RDS_PASSWORD,
      port: parseInt(process.env.RDS_PORT),
    });
    console.log('find cart');
    try {
      await client.connect();
      const {
        rows: [cart],
      } = await client.query(`SELECT id FROM carts 
     LIMIT 1`);
      const { rows: cartItems } = await client.query(
        `SELECT products.id as id, 
     products.title as title,
     products.description as description,
     products.price as price,
     cart_items.count as count 
     FROM cart_items
    LEFT JOIN products ON products.id = cart_items.product_id WHERE cart_id = $1`,
        [cart.id],
      );
      const items = cartItems.map(cartItem => {
        return {
          count: cartItem.count,
          product: { ...cartItem, count: undefined },
        };
      });
      console.log('return statement', { id: cart.id, items });
      await client.end();

      return { id: cart.id, items };
    } catch (error) {
      console.log(error);
      await client.end();
      return null;
    }
  }

  async createByUserId(userId: string) {
    console.log('creating cart');
    const client = new Client({
      user: process.env.RDS_USER,
      host: process.env.RDS_HOST,
      database: process.env.RDS_DB,
      password: process.env.RDS_PASSWORD,
      port: parseInt(process.env.RDS_PORT),
    });
    await client.connect();
    const {
      rows: [cart],
    } = await client.query(`INSERT INTO carts DEFAULT VALUES`);
    await client.end();

    return cart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    console.log('before req ');

    const userCart = await this.findByUserId(userId);
    console.log('after req');

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, items: any) {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);
    console.log(
      { id, ...rest }.items.map(item =>
        item.product.id === items.product.id
          ? (item.count = items.count)
          : item,
      ),
    );

    const client = new Client({
      user: process.env.RDS_USER,
      host: process.env.RDS_HOST,
      database: process.env.RDS_DB,
      password: process.env.RDS_PASSWORD,
      port: parseInt(process.env.RDS_PORT),
    });
    try {
      await client.connect();
      await client.query(
        `UPDATE cart_items SET count = $1 WHERE product_id = $2`,
        [items.count, items.product.id],
      );
      await client.end();
    } catch (error) {
      console.log(error);
    }
    const updatedCart = {
      id,
      items: rest.items.map(item =>
        item.product.id === items.product.id
          ? (item.count = items.count)
          : item,
      ),
    };

    console.log(updatedCart);

    return { updatedCart };
  }

  removeByUserId(userId): void {
    this.userCarts[userId] = null;
  }
}

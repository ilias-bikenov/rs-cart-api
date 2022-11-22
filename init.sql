BEGIN;


CREATE TABLE carts (id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
                                                created_at DATE NOT NULL DEFAULT current_timestamp,
                                                                                 updated_at DATE NOT NULL DEFAULT current_timestamp);


CREATE TABLE cart_items
  (cart_id uuid NOT NULL REFERENCES carts(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                                                          product_id uuid NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                                                                                                                                       count INT);


INSERT INTO carts DEFAULT
VALUES;


INSERT INTO cart_items (cart_id,product_id, count)
VALUES (
          (SELECT id
           FROM carts
           LIMIT 1),
          (SELECT id
           FROM products
           LIMIT 1), 3), (
                            (SELECT id
                             FROM carts
                             LIMIT 1),
                            (SELECT id
                             FROM products
                             LIMIT 1
                             OFFSET 1), 5);


COMMIT;
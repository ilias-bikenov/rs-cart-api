const { Client } = require('pg')
const test = async () => {
  const client = new Client({
    user: "postgres",
    host: "aws-shop-psql.cxxtgf3lyuhh.us-east-1.rds.amazonaws.com",
    database: "awsShopPsql",
    password: "postgres1337",
    port: 5432,
  });
  await client.connect()
  const {
    rows: [cart],
  } = await client.query(`SELECT id FROM carts 
 LIMIT 1`);
  const res = await client.query(
    `SELECT products.id as id, 
     products.title as title,
     products.description as description,
     products.price as price,
     cart_items.count as count 
     FROM cart_items
    LEFT JOIN products ON products.id = cart_items.product_id WHERE cart_id = $1`,
    [cart.id],
  );
  console.log('return statement', res);
  await client.end()
}
test()
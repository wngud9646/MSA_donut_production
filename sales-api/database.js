const mysql = require('mysql2/promise');
require('dotenv').config()
const AWS = require('aws-sdk');
const { getSecrets } = require('./secret');

const secretName = 'project3db';

/* const {
  host: hostname,
      user: username,
      password: password,
      database: database
} = process.env; */

const connectDb = async (req, res, next) => {
  try {
    const secrets = await getSecrets(secretName);

    const host = secrets.HOSTNAME;
    const user = secrets.USERNAME;
    const password = secrets.PASSWORD;
    const database = secrets.DATABASE;

    req.conn = await mysql.createConnection({ host, user, password, database })
    console.log("데이터베이스 연결")
    next()
  }
  catch(e) {
    console.log(e)
    res.status(500).json({ message: "데이터베이스 연결 오류" })
  }
}

const getProduct = (sku) => `
  SELECT BIN_TO_UUID(product_id) as product_id, name, price, stock, BIN_TO_UUID(factory_id), BIN_TO_UUID(ad_id)
  FROM product
  WHERE sku = "${sku}"
`

const setStock = (productId, stock) => `
  UPDATE product SET stock = ${stock} WHERE product_id = UUID_TO_BIN('${productId}')
`

module.exports = {
  connectDb,
  queries: {
    getProduct,
    setStock
  }
}
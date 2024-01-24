import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
    port: process.env.PORT,
  }
);

export const Pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345",
  database: "node_complete",
});

export const getConnectionFromPool = async () => {
  const connection = await pool.getConnection().catch((err) => {
    if (err) {
      console.log(err);
    }
  });
  if (!connection) {
    return null;
  }
  return connection;
};

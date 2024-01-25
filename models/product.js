import { Sequelize } from "sequelize";
import { sequelize } from "../utils/database.js";

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: Sequelize.STRING,
  description: Sequelize.STRING,
});

export default Product;

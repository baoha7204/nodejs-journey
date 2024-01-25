import { Sequelize } from "sequelize";
import { sequelize } from "../utils/database.js";

const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

export default Cart;

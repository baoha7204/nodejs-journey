import { Sequelize } from "sequelize";
import { sequelize } from "../utils/database.js";

const CartItem = sequelize.define("cartItem", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: Sequelize.INTEGER,
});

export default CartItem;

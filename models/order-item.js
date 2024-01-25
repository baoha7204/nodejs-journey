import { Sequelize } from "sequelize";
import { sequelize } from "../utils/database.js";

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: Sequelize.INTEGER,
});

export default OrderItem;

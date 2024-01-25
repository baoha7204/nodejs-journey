import { Sequelize } from "sequelize";
import { sequelize } from "../utils/database.js";

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

export default Order;

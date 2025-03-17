import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import { Status } from "../constants/index.js";
import { Transacciones } from "../constants/transacciones.js";
import { Cuenta } from "./cuentas.js";

export const Transaccion = sequelize.define(
  "transacciones",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [
            [Transacciones.DEPOSITO, Transacciones.TRANSFERENCIA, Transacciones.RETIRO],
          ],
          msg: "La transacción solo puede ser depósito, retiro o transferencia",
        },
      },
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "El monto no puede ser negativo",
        },
        notNull: {
          msg: "El monto no puede ser nulo",
        },
      },
    },
    status: {
      type: DataTypes.STRING(2),
      defaultValue: Status.ACTIVE,
      validate: {
        isIn: {
          args: [
            [Status.ACTIVE, Status.INACTIVE],
          ],
          msg: "El status solo puede ser 'active' o 'inactive'",
        },
        len: {
          args: [0, 2],
          msg: "El status debe tener entre 1 y 2 caracteres",
        },
      },
    },
    origen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "cuentas", 
        key: "id",
      },
    },
    destino: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "cuentas", 
        key: "id",
      },
    },
  },
  {
    freezeTableName: true, 
  }
);

Cuenta.hasMany(Transaccion, {
  foreignKey: "origen",
  as: "transaccionOrigen",
});
Transaccion.belongsTo(Cuenta, {
  foreignKey: "origen",
  as: "cuentaOrigen",
});

Cuenta.hasMany(Transaccion, {
  foreignKey: "destino",
  as: "transaccionDestino",
});
Transaccion.belongsTo(Cuenta, {
  foreignKey: "destino",
  as: "cuentaDestino",
});

export default Transaccion;

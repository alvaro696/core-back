// src/models/Role.js
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import { User } from "./users.js";
import { Status } from "../constants/index.js";

export const Cuenta = sequelize.define("cuentas", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    saldo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: 'El saldo no puede ser negativo'
            },
            notNull: {
                msg: 'Saldo no puede ser nulo',
            }
        }
    },
    status: {
        type: DataTypes.STRING(2),
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [
                    [Status.ACTIVE, Status.INACTIVE]
                ],
                msg: "Status solo puede ser active o inactive",
            },
            len: {
                args: [0, 2],
                msg: 'Status debe tener entre 1 y 2 caracteres',
            }
        },
    },
});
Cuenta.sync();

Cuenta.belongsTo(User, { as: "cuenta", foreignKey: "userId" });
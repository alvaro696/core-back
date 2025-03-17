// models/sala.js
import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";
import { Reserva } from "./reservas.js";
import { Status } from "../../constants/index.js";

export const Sala = sequelize.define('salas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [
                    [Status.ACTIVE, Status.INACTIVE]
                ],
                msg: "El estado solo puede ser active o inactive",
            },
        },
    },
});

//Sala.sync();

Sala.hasMany(Reserva, { foreignKey: 'salaId' });
Reserva.belongsTo(Sala, { foreignKey: 'id' });
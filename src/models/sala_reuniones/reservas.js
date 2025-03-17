// models/reserva.js
import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";
import { User } from "../users.js";
import { Status } from "../../constants/index.js";

export const Reserva = sequelize.define('reservas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    horaFin: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    salaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    solicitanteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

// Sincronizar el modelo con la base de datos (opcional)
//Reserva.sync();

User.hasMany(Reserva, { foreignKey: 'userId' });
Reserva.belongsTo(User, { foreignKey: 'id' });

User.hasMany(Reserva, { foreignKey: 'solicitanteId' });
Reserva.belongsTo(User, { foreignKey: 'id' });
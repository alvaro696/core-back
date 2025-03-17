import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";
import { Gerencia } from './gerencias.js';
import { Status } from "../../constants/index.js";

export const Area = sequelize.define('areas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El nombre no puede ser null',
            },
            notEmpty: {
                msg: 'El nombre no puede estar vacío',
            }
        }
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'El código no puede ser null',
            },
            notEmpty: {
                msg: 'El código no puede estar vacío',
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

Gerencia.hasMany(Area);
Area.belongsTo(Gerencia);
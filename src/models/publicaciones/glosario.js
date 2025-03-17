import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";
import { Status } from "../../constants/index.js";

export const Glosario = sequelize.define('glosario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    letra: {
        type: DataTypes.STRING(1),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La letra no puede ser null',
            },
            notEmpty: {
                msg: 'La letra no puede estar vacía',
            },
            len: {
                args: [1, 1],
                msg: 'La letra debe tener 1 caracter',
            }
        }
    },
    palabra: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La palabra no puede ser null',
            },
            notEmpty: {
                msg: 'La palabra no puede estar vacía',
            }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

Glosario.sync();
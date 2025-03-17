import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";
import { Status } from "../../constants/index.js";
import { User } from "../users.js";

export const Destacado = sequelize.define("personal_destacado", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    trimestre: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El trimestre no puede ser null',
            },
            len: {
                args: [1, 5],
                msg: 'El trimestre debe tener entre 1 y 5 caracteres',
            },
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
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
                msg: "Status solo puede ser active o inactive",
            },
            len: {
                args: [1, 2],
                msg: 'Status debe tener entre 1 y 2 caracteres',
            },
        },
    },
})

Destacado.sync();

Destacado.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Destacado, { foreignKey: 'userId' });
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import { Task } from "./tasks.js";
import { Status } from "../constants/index.js";
import { Role } from "./role.js";
import { Cargo } from "./oraganigrama/cargos.js";
import { Distrito } from "./oraganigrama/distritos.js";
import logger from "../logs/logger.js";
import { encriptar } from "../common/bcrypt.js";

export const User = sequelize.define("users", {
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
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Username no puede ser nulo",
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Password no puede ser null",
            },
        },
    },
    nombres: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Nombres no puede ser null",
            },
        }
    },
    paterno: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Paterno no puede ser null",
            },
        }
    },
    materno: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    cargoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cargo,
            key: "id",
        },
        validate: {
            notNull: {
                msg: "Cargo no puede ser null",
            },
        }
    },
    distritoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Distrito,
            key: "id",
        },
        validate: {
            notNull: {
                msg: "Distrito no puede ser null",
            },
        }
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: "id",
        },
    },
});

// Relaciones
User.hasMany(Task);
Task.belongsTo(User);

User.belongsTo(Role, { as: "Role", foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

User.belongsTo(Cargo, { as: "Cargo", foreignKey: "cargoId" }); // Relación con Cargo
Cargo.hasMany(User, { foreignKey: "cargoId" });

User.belongsTo(Distrito, { as: "Distrito", foreignKey: "distritoId" }); // Relación con Distrito
Distrito.hasMany(User, { foreignKey: "distritoId" });

// Hooks para encriptar la contraseña
User.beforeCreate(async(user) => {
    try {
        user.password = await encriptar(user.password);
    } catch (error) {
        logger.error(error.message);
        throw new Error("Error al encriptar la contraseña");
    }
});

User.beforeUpdate(async(user) => {
    if (user.changed("password")) { // Solo encriptar si la contraseña cambió
        try {
            user.password = await encriptar(user.password);
        } catch (error) {
            logger.error(error.message);
            throw new Error("Error al encriptar la contraseña");
        }
    }
});
// models/publicacion.js
import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";
import { Status } from "../../constants/index.js";
import { Publicaciones } from "../../constants/publicaciones.js";
import { Area } from "../oraganigrama/areas.js";
import { User } from "../users.js";

export const Publicacion = sequelize.define("publicaciones", {
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
                    [Status.ACTIVE, Status.INACTIVE],
                ],
                msg: "Status solo puede ser active o inactive",
            },
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
    },
    areaId: {
        type: DataTypes.INTEGER,
        references: {
            model: "areas",
            key: "id",
        },
    },
    tipo: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            isIn: {
                args: [
                    [Publicaciones],
                ],
                msg: "Tipo solo puede ser alguno de la lista",
            },
            len: {
                args: [1, 30],
                msg: "El tipo debe tener entre 1 y 30 caracteres",
            },
        },
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El nombre no puede ser nulo",
            },
            len: {
                args: [1, 255],
                msg: "El nombre debe tener entre 1 y 255 caracteres",
            },
        },
    },
    fechaMaximaExposicion: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    imagenAdjunta: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "La imagen adjunta es obligatoria",
            },
        },
    },
    archivoAdjunto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

Publicacion.sync();

Publicacion.belongsTo(User, { as: "user", foreignKey: "userId" });
Publicacion.belongsTo(Area, { as: "area", foreignKey: "areaId" });
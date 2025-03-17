import { User } from "../models/users.js";
import { Task } from "../models/tasks.js";
import { Role } from "../models/role.js";
import { Cargo } from "../models/oraganigrama/cargos.js";
import { Area } from "../models/oraganigrama/areas.js";
import { Gerencia } from "../models/oraganigrama/gerencias.js";
import { Distrito } from "../models/oraganigrama/distritos.js";
import { Status } from "../constants/index.js";
import { Op } from "sequelize";
import logger from "../logs/logger.js";
import axios from "axios";
import sequelize from "../database/database.js";

async function getUsers(req, res) {
    logger.info("Llega petición listar usuarios");
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {
            status: Status.ACTIVE,
        };

        if (search) {
            whereClause.username = {
                [Op.like]: `%${search}%`,
            };
        }

        const result = await User.findAndCountAll({
            attributes: ["id", "username", "status", "roleId", "nombres", "paterno", "materno"],
            include: [{
                model: Role,
                as: "Role",
                attributes: ["name"],
            },
            {
                model: Cargo,
                as: "Cargo",
                attributes: ["name"],
                include: [{
                    model: Area,
                    as: "area",
                    attributes: ["name"],
                    include: [{
                        model: Gerencia,
                        as: "gerencia",
                        attributes: ["name"],
                    },],
                },],
            },
            {
                model: Distrito,
                as: "Distrito",
                attributes: ["name"],
            },
            ],
            where: whereClause,
            order: [
                ["id", "DESC"]
            ],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
        });

        // Mapeamos cada usuario para agregar la información necesaria
        const data = result.rows.map((user) => {
            const userJson = user.toJSON();
            return {
                id: userJson.id,
                username: userJson.username,
                status: userJson.status,
                nombres: userJson.nombres,
                paterno: userJson.paterno,
                materno: userJson.materno,
                role: userJson.Role ? userJson.Role.name : "No asignado",
                cargo: userJson.Cargo ? userJson.Cargo.name : "No asignado",
                area: userJson.Cargo && userJson.Cargo.area ? userJson.Cargo.area.name : "No asignado",
                gerencia: userJson.Cargo && userJson.Cargo.area && userJson.Cargo.area.gerencia ? userJson.Cargo.area.gerencia.name : "No asignado",
                distrito: userJson.Distrito ? userJson.Distrito.name : "No asignado",
            };
        });

        res.json({
            data,
            total: result.count,
        });
    } catch (error) {
        logger.error("Error en getUsers: " + error.message);
        res.status(500).json({ message: "Error del servidor" });
    }
}

async function createUser(req, res) {
    try {
        const { username, password, roleId, nombres, paterno, materno, cargoId, distritoId, fecha_nacimiento } = req.body;

        const userExists = await User.findOne({
            where: {
                username
            },
        });

        if (userExists) {
            return res.status(400).json({ message: "Usuario ya existe" });
        }

        const cargo = await Cargo.findOne({
            where: { id: cargoId },
            include: [{
                model: Area,
                as: "area",
                include: [{
                    model: Gerencia,
                    as: "gerencia",
                },],
            },],
        });

        const distrito = await Distrito.findOne({
            where: { id: distritoId },
        });

        if (!cargo || !distrito) {
            return res.status(400).json({ message: "Cargo o Distrito no encontrado" });
        }

        const user = await User.create({ username, password, roleId, nombres, paterno, materno, cargoId, distritoId, fecha_nacimiento });
        logger.info("Se crea usuario");

        if (!user) {
            return res.status(400).json({ message: "Error al crear usuario" });
        }

        // Salio todo bien
        res.json(user);
        /* try {
            const response = await axios.post(process.env.URL_LEGACY + '/unisersoft_bk/action/intranet/user_crear.php', dataSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200 || response.status === 201) {
                logger.info("Datos enviados correctamente a la otra API");
                const { username, correo } = response.data;
                if (!username || !correo) {
                    logger.warn("Unisersoft no devolvió username o correo");
                    return res.status(500).json({ message: "Error en Unisersoft: faltan datos" });
                }

                const user = await User.create({ username, correo, password, roleId, nombres, paterno, materno, cargoId, distritoId, fecha_nacimiento });
                logger.info("Se crea usuario");

                if (!user) {
                    return res.status(400).json({ message: "Error al crear usuario" });
                }

                // Salio todo bien
                res.json(user);
            } else {
                logger.warn("Unisersoft no respondió como se esperaba");
                res.status(500).json({ message: "Error en Unisersoft" });
            }

        } catch (error) {
            logger.error("Error al enviar datos a la otra API: " + error.message);
            if (error.response) {
                res.status(error.response.status).json({ message: error.response.data });
            } else {
                res.status(500).json({ message: "Error del servidor" });
            }
        }
 */
    } catch (error) {
        logger.error("Error en createUser: " + error.message);
        res.status(500).json({ message: "Server error" });
    }
}

async function getUser(reg, res) {
    try {
        const user = await User.findByPk(reg.params.id, {
            attributes: ["username", "status"],
        });
        if (!user) {
            return res.status(404).json({ message: "User no encontrado" });
        }
        res.json(user);
    } catch (error) {
        logger.error("error al obtenre usuario " + error);
        res.status(500).json({ message: "server error" });
    }
}

async function updateuser(req, res) {
    const { id } = req.params;
    const { username, password, roleId, status } = req.body;
    try {
        if (!username || !password)
            return res.status(400).json({ message: "Usuario o password requerido" });
        const user = await User.update({
            username,
            password,
            roleId,
            status,
        }, {
            where: {
                id,
            },
        });
        res.json(user);
    } catch (error) {
        logger.error("error al actualizar usuario " + error.message);
        res.status(500).json({ message: "server error" });
    }
}

async function activateInactivate(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if (!status) return res.status(400).json({ message: "Status requerido" });
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encotnrado" });
        }
        if (user.status === status) {
            return res.status(400).json({ message: "Es el mismo status" });
        }
        user.status = status;
        await user.save();
        res.json(user);
    } catch (error) {
        logger.error("error al actualizar usuario " + error.message);
        res.status(500).json({ message: "server error" });
    }
}

async function deleteUser(req, res) {
    logger.info("llega peticion de delete");
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User no encotnrado" });
        }
        await user.destroy();
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        logger.error("error al eliminar usuario " + error.message);
        res.status(500).json({ message: "server error" });
    }
}

async function getTasks(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ["username"],
            include: [{
                model: Task,
                attributes: ["name", "done"],
                /* where: {
                          'done': true
                      }, */
            },],
            where: { id },
        });
        res.json(user);
    } catch (error) {
        logger.error("error al obtener tareas de usuario " + error.message);
        res.status(500).json({ message: "server error" });
    }
}

async function getTasksAll(req, res) {
    try {
        const user = await User.findAll({
            attributes: ["username"],
            include: [{
                model: Task,
                attributes: ["name", "done"],
                /* where: {
                          'done': true
                      }, */
            },],
        });
        res.json(user);
    } catch (error) {
        logger.error("error al obtener tareas de usuario " + error.message);
        res.status(500).json({ message: "server error" });
    }
}

async function getCumpleanieros(req, res) {
    const { day } = req.params;

    try {
        const users = await User.findAll({
            attributes: ["username", "nombres", "paterno", "materno"],
            where: sequelize.where(
                sequelize.fn('DATE_FORMAT', sequelize.col('fecha_nacimiento'), '%m-%d'),
                day
            ),
        });

        if (!users || users.length === 0) {
            return res.json({ message: "No hay cumpleañeros en este día" });
        }

        const response = users.map(user => ({
            nombre: `${user.nombres} ${user.paterno} ${user.materno}`,
            foto: user.username,
            //fecha_nacimiento: user.fecha_nacimiento,
        }));

        res.json(response);
    } catch (error) {
        logger.error("Error al obtener cumpleañeros: " + error.message);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export default {
    getUsers,
    createUser,
    getUser,
    updateuser,
    activateInactivate,
    deleteUser,
    getTasks,
    getTasksAll,
    getCumpleanieros,
};
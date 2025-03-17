import { User } from "../models/users.js";
import { Task } from "../models/tasks.js";
import { Role } from "../models/role.js";
import { Distrito } from "../models/oraganigrama/distritos.js";
import { Status } from "../constants/index.js";
import { Op } from "sequelize";
import logger from "../logs/logger.js";

async function getUsers(req, res) {
    logger.info("Llega petición listar usuarios");
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {
            status: String(Status.ACTIVE),
        };

        if (search) {
            whereClause.username = {
                [Op.like]: `%${search}%`,
            };
        }

        const result = await User.findAndCountAll({
            attributes: ["id", "username", "status", "roleId", "nombres", "paterno", "materno"],
            include: [
                {
                    model: Role,
                    as: "Role",
                    attributes: ["name"],
                },
                {
                    model: Distrito,
                    as: "Distrito",
                    attributes: ["name"],
                },
            ],
            where: whereClause,
            order: [["id", "DESC"]],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
        });

        const data = result.rows.map((user) => {
            const userJson = user.toJSON();
            return {
                id: userJson.id,
                username: userJson.username,
                status: userJson.status,
                nombres: userJson.nombres,
                paterno: userJson.paterno,
                materno: userJson.materno,
                distrito: userJson.Distrito ? userJson.Distrito.name : "No asignado",
            };
        });

        res.json({
            data,
            total: result.count,
        });
    } catch (error) {
        logger.error("Error en getUsers: " + error.message);
        res.status(500).json({ message: "Error en el servidor" });
    }
}
async function createUser(req, res) {
    try {
        const {
            username,
            password,
            roleId,
            distritoId = 1,
            nombres = 'test',
            paterno = 'test',
            fecha_nacimiento = null
        } = req.body;

        const userExists = await User.findOne({
            where: { username }
        });
        if (userExists) {
            return res.status(400).json({ message: "Usuario ya existe" });
        }

        const user = await User.create({
            username,
            password,
            roleId,
            distritoId,
            paterno,
            nombres,
            fecha_nacimiento
        });
        logger.info("Se crea usuario");

        if (!user) {
            return res.status(400).json({ message: "Error al crear usuario" });
        }

        res.json(user);
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


export default {
    getUsers,
    createUser,
    getUser,
    updateuser,
    activateInactivate,
    deleteUser,
};
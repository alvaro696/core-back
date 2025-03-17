import { User } from "../models/users.js";
import { Cuenta } from "../models/cuentas.js";
import logger from "../logs/logger.js";
import { Status } from "../constants/index.js";

// Listar permisos
async function getCuentas(req, res) {
    const { userId } = req.user;
    try {
        const cuentas = await Cuenta.findAll({
            where: { userId },
        });
        res.json({ data: cuentas });
    } catch (error) {
        console.error("Error en getCuentas:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}

// Crear un permiso
async function createCuenta(req, res) {
    const { userId } = req.user;
    try {
        const { saldo } = req.body;
        const cuenta = await Cuenta.create({ userId, saldo });
        res
            .status(201)
            .json({ message: "Cuenta creado" + cuenta });
    } catch (error) {
        console.error("Error en createCuenta:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}

// Actualizar un permiso
async function updateCuenta(req, res) {
    try {
        const { id } = req.params;
        const { userId, saldo } = req.body;
        const cuenta = await Cuenta.findByPk(id);
        if (!cuenta) {
            return res.status(404).json({ message: "Cuenta no encontrado" });
        }
        cuenta.saldo = saldo;
        await cuenta.save();
        res.json({ message: "cuenta actualizado", cuenta });
    } catch (error) {
        console.error("Error en updateCuenta:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}

// Eliminar un permiso
async function deleteCuenta(req, res) {
    try {
        const { id } = req.params;
        const cuenta = await Cuenta.findByPk(id);
        if (!cuenta) {
            return res.status(404).json({ message: "Cuenta no encontrado" });
        }

        cuenta.status = Status.INACTIVE;
        await cuenta.save();
        res.json({ message: "cuenta Eliminada", cuenta });
    } catch (error) {
        console.error("Error en deletePermission:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}

export default {
    getCuentas,
    createCuenta,
    updateCuenta,
    deleteCuenta
};

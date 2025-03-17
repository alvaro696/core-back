import { User } from "../models/users.js";
import { Transaccion } from "../models/transacciones.js";
import logger from "../logs/logger.js";
import { Status } from "../constants/index.js";
import { Cuenta } from "../models/cuentas.js";
import sequelize from "../database/database.js";

import { Op } from 'sequelize';
import { Transacciones } from "../constants/transacciones.js";

async function crear(req, res) {
    const { tipo, monto, origen, destino } = req.body;
    const t = await sequelize.transaction();
    try {
        console.info("Monto:", monto);

        const cuentaOrigen = await Cuenta.findOne({
            where: { id: origen },
            transaction: t,
        });
        if (!cuentaOrigen) {
            await t.rollback();
            return res.status(404).json({ message: "No se encontró la cuenta de origen" });
        }
        console.info("Cuenta origen, saldo:", cuentaOrigen.saldo);

        let cuentaDestino = null;
        if (tipo === "3") {
            cuentaDestino = await Cuenta.findByPk(destino, { transaction: t });
            if (!cuentaDestino) {
                await t.rollback();
                return res.status(404).json({ message: "No se encontró la cuenta de destino" });
            }
            const oneMinuteAgo = new Date(Date.now() - 60000);
            const transferCount = await Transaccion.count({
                where: {
                    tipo: "3",
                    origen,
                    createdAt: { [Op.gte]: oneMinuteAgo },
                },
                transaction: t,
            });

            if (transferCount >= 5) {
                await Cuenta.update(
                    { status: "INACTIVE" },
                    { where: { id: origen }, transaction: t }
                );
                await t.rollback();
                return res.status(403).json({
                    message: "Límite de transferencias excedido, cuenta inactivada",
                });
            }
            if (transferCount >= 3) {
                await t.rollback();
                return res.status(429).json({
                    message: "Máximo 3 transferencias permitidas por minuto",
                });
            }
        }

        const montoFloat = parseFloat(monto);
        const saldoOrigen = parseFloat(cuentaOrigen.saldo);

        switch (tipo) {
            case "1": 
                cuentaOrigen.saldo = saldoOrigen + montoFloat;
                break;
            case "2": 
                if (saldoOrigen < montoFloat) {
                    await t.rollback();
                    return res.status(400).json({ message: "Saldo insuficiente para retiro" });
                }
                cuentaOrigen.saldo = saldoOrigen - montoFloat;
                break;
            case "3": 
                if (saldoOrigen < montoFloat) {
                    await t.rollback();
                    return res.status(400).json({ message: "Saldo insuficiente para transferencia" });
                }
                cuentaOrigen.saldo = saldoOrigen - montoFloat;
                cuentaDestino.saldo = parseFloat(cuentaDestino.saldo) + montoFloat;
                await cuentaDestino.save({ transaction: t });
                break;
            default:
                await t.rollback();
                return res.status(400).json({ message: "Tipo de transacción no válido" });
        }

        console.info("Cuenta origen después:", cuentaOrigen.saldo);
        await cuentaOrigen.save({ transaction: t });

        const transaccion = await Transaccion.create(
            {
                tipo,
                monto: montoFloat,
                origen,
                destino: tipo === "3" ? destino : null,
            },
            { transaction: t }
        );

        await t.commit();
        res.status(201).json({ message: "Transacción creada", transaccion });
    } catch (error) {
        await t.rollback();
        console.error("Error en crear transacción:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}


async function obtener(req, res) {
    const { userId } = req.user;
    try {
        const transacciones = await Transaccion.findAll({
            include: [
                {
                    model: Cuenta,
                    as: "cuentaOrigen",
                    attributes: ["id", "userId"],
                },
                {
                    model: Cuenta,
                    as: "cuentaDestino",
                    attributes: ["id", "userId"],
                },
            ],
            where: {
                [Op.or]: [
                    { "$cuentaOrigen.userId$": userId },
                    { "$cuentaDestino.userId$": userId },
                ],
            },
            order: [["id", "DESC"]],
        });

        const transaccionesFormateadas = transacciones.map((trx) => {
            const json = trx.toJSON();
            let montoFormateado = parseFloat(json.monto);
            if (json.tipo !== "1") {
                montoFormateado = -Math.abs(montoFormateado);
            } else {
                montoFormateado = Math.abs(montoFormateado);
            }
            return {
                ...json,
                monto: montoFormateado,
            };
        });

        res.json({ data: transaccionesFormateadas });
    } catch (error) {
        console.error("Error en getTransaccion:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}

async function actualizar(req, res) {
    try {
        const { id } = req.params;
        const { tipo, monto, origen, destino } = req.body;
        const transaccion = await Transaccion.findByPk(id);
        if (!transaccion) {
            return res.status(404).json({ message: "transaccion no encontrada" });
        }
        transaccion.tipo = tipo;
        transaccion.monto = monto;
        transaccion.origen = origen;
        transaccion.destino = destino;
        await transaccion.save();
        res.json({ message: "transaccion actualizado", transaccion });
    } catch (error) {
        console.error("Error en updatetransaccion:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}

async function eliminar(req, res) {
    try {
        const { id } = req.params;
        const transaccion = await Cuenta.findByPk(id);
        if (!transaccion) {
            return res.status(404).json({ message: "transaccion no encontrado" });
        }
        transaccion.status = Status.INACTIVE;
        await transaccion.save();
        res.json({ message: "transaccion Eliminada", transaccion });
    } catch (error) {
        console.error("Error en deletePermission:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}

export default {
    crear,
    obtener,
    actualizar,
    eliminar
};

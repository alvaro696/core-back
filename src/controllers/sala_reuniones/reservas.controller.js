import { Reserva } from '../../models/sala_reuniones/reservas.js';
import { Sala } from '../../models/sala_reuniones/salas.js';
import { Op } from 'sequelize';
import logger from "../../logs/logger.js";
import { User } from '../../models/users.js';
import { Cargo } from '../../models/oraganigrama/cargos.js';
import { Area } from '../../models/oraganigrama/areas.js';
import { Gerencia } from '../../models/oraganigrama/gerencias.js';

async function crearReserva(req, res) {
    const { fecha, horaInicio, horaFin, salaId, solicitanteId } = req.body;
    const { userId } = req.user;

    try {
        console.log("lelga");
        const sala = await Sala.findByPk(salaId);
        if (!sala) {
            logger.warn("No se encontro la sala");
            return res.status(404).json({ message: "Sala no encontrada" });
        }

        const reservaExistente = await Reserva.findOne({
            where: {
                salaId,
                fecha,
                [Op.or]: [{
                        horaInicio: {
                            [Op.between]: [horaInicio, horaFin]
                        },
                    },
                    {
                        horaFin: {
                            [Op.between]: [horaInicio, horaFin]
                        },
                    },
                ],
            },
        });

        if (reservaExistente) {
            logger.warn("La sala ya esta reservada");
            return res.status(400).json({ message: "La sala ya está reservada en ese horario" });
        }

        const reserva = await Reserva.create({
            fecha,
            horaInicio,
            horaFin,
            userId,
            salaId,
            solicitanteId,
        });

        logger.info("Se crea una reserva");
        res.status(201).json(reserva);
    } catch (error) {
        logger.error("Se produjo un error");
        res.status(500).json({ message: "Error del servidor" });
    }
};

async function obtenerReservasPorSala(req, res) {
    const { fecha } = req.params;

    try {
        const reservas = await Reserva.findAll({
            where: {
                fecha,
            },
            include: [{
                    model: User,
                    attributes: ['nombres', 'paterno'],
                    include: [{
                        model: Cargo,
                        as: "Cargo",
                        attributes: ["name"],
                        include: [{
                            model: Area,
                            as: "area",
                            attributes: ["name"],
                        }, ],
                    }, ],
                },
                {
                    model: Sala,
                    attributes: ['nombre'],
                },
            ],
            attributes: ['horaInicio', 'horaFin'],
        });

        // Formatear la respuesta
        const respuesta = reservas.map(reserva => ({
            horaInicio: reserva.horaInicio,
            horaFin: reserva.horaFin,
            solicitante: `${reserva.user.nombres} ${reserva.user.paterno}`,
            area: reserva.user.Cargo.area.name || "No asignado",
            sala: reserva.sala.nombre,
        }));

        res.json(respuesta);
    } catch (error) {
        console.error("Error en obtenerReservasPorSala:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export default {
    crearReserva,
    obtenerReservasPorSala,
};
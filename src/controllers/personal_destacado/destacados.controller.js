import { Destacado } from '../../models/personal_destacado/destacados.js';
import logger from '../../logs/logger.js';
import { Cargo } from '../../models/oraganigrama/cargos.js';
import { Area } from '../../models/oraganigrama/areas.js';
import { User } from '../../models/users.js';

async function crearDestacados(req, res) {
    const { trimestre, userIds } = req.body;

    try {
        const destacados = await Promise.all(
            userIds.map(async(userId) => {
                return await Destacado.create({
                    trimestre,
                    userId,
                });
            })
        );
        logger.info('Destacados creados');
        res.status(201).json(destacados);
    } catch (error) {
        logger.error('Error en crearDestacados: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

async function obtenerDestacados(req, res) {
    const { trimestre } = req.params;

    try {
        const destacados = await Destacado.findAll({
            where: { trimestre },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'nombres', 'paterno', 'username'],
                include: [{
                    model: Cargo,
                    as: 'Cargo',
                    attributes: ['name'],
                    include: [{
                        model: Area,
                        as: 'area',
                        attributes: ['name'],
                    }, ],
                }, ],
            }, ],
        });

        // Formatear la respuesta
        const respuesta = destacados.map(destacado => ({
            foto: `${destacado.user.username}`,
            persona_destacada: `${destacado.user.nombres} ${destacado.user.paterno}`,
            cargo: destacado.user.Cargo.name,
            area: destacado.user.Cargo.area.name || "No asignado",
        }));
        logger.info(`Destacados del trimestre ${trimestre}`);

        res.json(respuesta);
    } catch (error) {
        logger.error('Error en obtenerDestacadosPorTrimestre: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export default {
    crearDestacados,
    obtenerDestacados
};
// controllers/salaController.js
import { Sala } from '../../models/sala_reuniones/salas.js';
import { Status } from '../../constants/index.js';
import logger from '../../logs/logger.js';

// Obtener todas las salas
async function getSalas(req, res) {
    try {
        const salas = await Sala.findAll({
            attributes: ['id', 'nombre', 'capacidad', 'descripcion', 'status'],
            order: [
                ['nombre', 'ASC']
            ],
        });
        res.json(salas);
    } catch (error) {
        logger.error('Error en getSalas: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Crear una sala
async function createSala(req, res) {
    const { nombre, capacidad, descripcion } = req.body;
    try {
        const sala = await Sala.create({
            nombre,
            capacidad,
            descripcion,
        });
        res.json(sala);
    } catch (error) {
        logger.error('Error en createSala: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Obtener una sala por ID
async function getSala(req, res) {
    const { id } = req.params;
    try {
        const sala = await Sala.findOne({
            attributes: ['id', 'nombre', 'capacidad', 'descripcion', 'status'],
            where: { id },
        });
        if (!sala) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        res.json(sala);
    } catch (error) {
        logger.error('Error en getSala: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Actualizar una sala
async function updateSala(req, res) {
    const { id } = req.params;
    const { nombre, capacidad, descripcion } = req.body;
    try {
        const [updated] = await Sala.update({ nombre, capacidad, descripcion }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        res.json({ message: 'Sala actualizada correctamente' });
    } catch (error) {
        logger.error('Error en updateSala: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Eliminar una sala (cambiar estado a INACTIVE)
async function deleteSala(req, res) {
    const { id } = req.params;
    try {
        const [updated] = await Sala.update({ status: Status.INACTIVE }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        res.json({ message: 'Sala eliminada correctamente' });
    } catch (error) {
        logger.error('Error en deleteSala: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export default {
    getSalas,
    createSala,
    getSala,
    updateSala,
    deleteSala,
};
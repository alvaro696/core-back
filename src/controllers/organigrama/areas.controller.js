import { Area } from "../../models/oraganigrama/areas.js";
import logger from "../../logs/logger.js";
import { Gerencia } from "../../models/oraganigrama/gerencias.js";

// Obtener todas las áreas
async function getAreas(req, res) {
    try {
        const areas = await Area.findAll({
            attributes: ['id', 'name', 'codigo', 'status'],
            include: [{
                model: Gerencia,
                attributes: ['id', 'name', 'codigo']
            }],
            order: [
                ['name', 'ASC']
            ],
        });
        res.json(areas);
    } catch (error) {
        logger.error('Error en getAreas: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Crear una nueva área
async function createArea(req, res) {
    const { name, codigo, gerenciaId } = req.body; // Incluye gerenciaId para la relación
    try {
        const area = await Area.create({
            name,
            codigo,
            gerenciaId, // Asigna la gerencia a la que pertenece el área
        });
        res.json(area);
    } catch (error) {
        logger.error('Error en createArea: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Obtener un área por su ID
async function getArea(req, res) {
    const { id } = req.params;
    try {
        const area = await Area.findOne({
            attributes: ['id', 'name', 'codigo', 'status'], // Selecciona los campos que deseas devolver
            where: { id },
        });
        if (!area) {
            return res.status(404).json({ message: 'Área no encontrada' });
        }
        res.json(area);
    } catch (error) {
        logger.error('Error en getArea: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Actualizar un área
async function updateArea(req, res) {
    const { id } = req.params;
    const { name, codigo, status } = req.body;
    try {
        const [updated] = await Area.update({ name, codigo, status }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Área no encontrada' });
        }
        res.json({ message: 'Área actualizada correctamente' });
    } catch (error) {
        logger.error('Error en updateArea: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

async function deleteArea(req, res) {
    const { id } = req.params;
    try {
        const [updated] = await Area.update({ status: Status.INACTIVE }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Área no encontrada' });
        }
        res.json({ message: 'Área eliminada correctamente' });
    } catch (error) {
        logger.error('Error en deleteArea: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export default {
    getAreas,
    createArea,
    getArea,
    updateArea,
    deleteArea,
};
import { Distrito } from "../../models/oraganigrama/distritos.js";
import logger from "../../logs/logger.js";

// Obtener todos los distritos
async function getDistritos(req, res) {
    try {
        const distritos = await Distrito.findAll({
            attributes: ['id', 'name', 'status'],
            order: [
                ['name', 'ASC']
            ],
        });
        res.json(distritos);
    } catch (error) {
        logger.error('Error en getDistritos: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Crear un nuevo distrito
async function createDistrito(req, res) {
    const { name } = req.body;
    try {
        const distrito = await Distrito.create({
            name,
        });
        res.json(distrito);
    } catch (error) {
        logger.error('Error en createDistrito: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Obtener un distrito por su ID
async function getDistrito(req, res) {
    const { id } = req.params;
    try {
        const distrito = await Distrito.findOne({
            attributes: ['id', 'name', 'status'],
            where: { id },
        });
        if (!distrito) {
            return res.status(404).json({ message: 'Distrito no encontrado' });
        }
        res.json(distrito);
    } catch (error) {
        logger.error('Error en getDistrito: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Actualizar un distrito
async function updateDistrito(req, res) {
    const { id } = req.params;
    const { name, status } = req.body;
    try {
        const [updated] = await Distrito.update({ name, status }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Distrito no encontrado' });
        }
        res.json({ message: 'Distrito actualizado correctamente' });
    } catch (error) {
        logger.error('Error en updateDistrito: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Eliminar un distrito
async function deleteDistrito(req, res) {
    const { id } = req.params;
    try {
        const [updated] = await Distrito.update({ status: Status.INACTIVE }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Distrito no encontrada' });
        }
        res.json({ message: 'Distrito eliminada correctamente' });
    } catch (error) {
        logger.error('Error en deleteDistrito: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export default {
    getDistritos,
    createDistrito,
    getDistrito,
    updateDistrito,
    deleteDistrito,
};
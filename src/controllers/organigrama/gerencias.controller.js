import { Gerencia } from "../../models/oraganigrama/gerencias.js";
import { Status } from "../../constants/index.js";
import logger from "../../logs/logger.js";

async function getGerencias(req, res) {
    try {
        const gerencias = await Gerencia.findAll({
            attributes: ['id', 'name', 'codigo', 'status'],
            order: [
                ['name', 'ASC']
            ],
        });
        res.json(gerencias);
    } catch (error) {
        logger.error('Error en getGerencias: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

async function createGerencia(req, res) {
    const { name, codigo } = req.body;
    try {
        const gerencia = await Gerencia.create({
            name,
            codigo,
        });
        res.json(gerencia);
    } catch (error) {
        logger.error('Error en createGerencia: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

async function getGerencia(req, res) {
    const { id } = req.params;
    try {
        const gerencia = await Gerencia.findOne({
            attributes: ['id', 'name', 'codigo', 'status'],
            where: { id },
        });
        if (!gerencia) {
            return res.status(404).json({ message: 'Gerencia no encontrada' });
        }
        res.json(gerencia);
    } catch (error) {
        logger.error('Error en getGerencia: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

async function updateGerencia(req, res) {
    const { id } = req.params;
    const { name, codigo } = req.body;
    try {
        const [updated] = await Gerencia.update({ name, codigo }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Gerencia no encontrada' });
        }
        res.json({ message: 'Gerencia actualizada correctamente' });
    } catch (error) {
        logger.error('Error en updateGerencia: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

async function deleteGerencia(req, res) {
    const { id } = req.params;
    try {
        const [updated] = await Gerencia.update({ status: Status.INACTIVE }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Gerencia no encontrada' });
        }
        res.json({ message: 'Gerencia eliminada correctamente' });
    } catch (error) {
        logger.error('Error en deleteGerencia: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export default {
    getGerencias,
    createGerencia,
    getGerencia,
    updateGerencia,
    deleteGerencia,
};
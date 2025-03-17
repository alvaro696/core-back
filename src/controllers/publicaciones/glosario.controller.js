import { Glosario } from "../../models/publicaciones/glosario.js";
import logger from "../../logs/logger.js";
import { Status } from "../../constants/index.js";

// Obtener todos los glosarios
async function getGlosarios(req, res) {
    try {
        const glosarios = await Glosario.findAll({
            attributes: ['letra', 'palabra', 'descripcion'],
            where: { status: Status.ACTIVE },
            order: [
                ['letra', 'ASC']
            ],
        });

        res.json(glosarios);
    } catch (error) {
        logger.error('Error en getGlosarios: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Crear un nuevo glosario
async function createGlosario(req, res) {
    const { palabra, descripcion } = req.body;
    try {
        if (!palabra) {
            return res.status(400).json({ message: 'La palabra es requerida' });
        }

        const plabraExist = await Glosario.findOne({
            where: { palabra },
        });

        if (plabraExist) {
            return res.status(400).json({ message: 'La palabra ya existe' });
        }

        const trimmed = palabra.trim();

        if (trimmed.length === 0) {
            return res.status(400).json({ message: 'La palabra no puede estar vacía' });
        }

        const removeAccents = (str) =>
            str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        const firstChar = trimmed.charAt(0);
        const letraSinAcento = removeAccents(firstChar).toUpperCase();

        console.log('Letra sin acento:', letraSinAcento);

        const glosario = await Glosario.create({
            letra: letraSinAcento,
            palabra,
            descripcion,
        });

        if (!glosario) {
            return res.status(400).json({ message: 'Error al crear el glosario' });
        }

        res.json(glosario);
    } catch (error) {
        logger.error('Error en createGlosario: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Obtener un glosario por su ID
async function getGlosario(req, res) {
    const { id } = req.params;
    try {
        const glosario = await Glosario.findOne({
            attributes: ['id', 'status', 'letra', 'palabra', 'descripcion'],
            where: { id },
        });
        if (!glosario) {
            return res.status(404).json({ message: 'Glosario no encontrado' });
        }
        res.json(glosario);
    } catch (error) {
        logger.error('Error en getGlosario: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Actualizar un glosario
async function updateGlosario(req, res) {
    const { id } = req.params;
    const { letra, palabra, descripcion, status } = req.body;
    try {
        const [updated] = await Glosario.update({ letra, palabra, descripcion, status }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Glosario no encontrado' });
        }
        res.json({ message: 'Glosario actualizado correctamente' });
    } catch (error) {
        logger.error('Error en updateGlosario: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Eliminar un glosario (borrado lógico cambiando el status)
async function deleteGlosario(req, res) {
    const { id } = req.params;
    try {
        const [updated] = await Glosario.update({ status: Status.INACTIVE }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Glosario no encontrado' });
        }
        res.json({ message: 'Glosario eliminado correctamente' });
    } catch (error) {
        logger.error('Error en deleteGlosario: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export default {
    getGlosarios,
    createGlosario,
    getGlosario,
    updateGlosario,
    deleteGlosario,
};
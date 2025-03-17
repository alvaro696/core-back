import { Cargo } from "../../models/oraganigrama/cargos.js";
import { Area } from "../../models/oraganigrama/areas.js";
import { Gerencia } from "../../models/oraganigrama/gerencias.js";
import logger from "../../logs/logger.js";

// Obtener todos los cargos
async function getCargos(req, res) {
    try {
        const cargos = await Cargo.findAll({
            attributes: ['id', 'name', 'codigo', 'status'],
            order: [
                ['name', 'ASC']
            ],
        });
        res.json(cargos);
    } catch (error) {
        logger.error('Error en getCargos: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Crear un nuevo cargo
async function createCargo(req, res) {
    const { name, codigo, areaId } = req.body;
    try {
        const cargo = await Cargo.create({
            name,
            codigo,
            areaId,
        });
        res.json(cargo);
    } catch (error) {
        logger.error('Error en createCargo: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Obtener un cargo por su ID
async function getCargo(req, res) {
    const { id } = req.params;
    try {
        const cargo = await Cargo.findOne({
            attributes: ['id', 'name', 'codigo', 'status'],
            where: { id },
        });
        if (!cargo) {
            return res.status(404).json({ message: 'Cargo no encontrado' });
        }
        res.json(cargo);
    } catch (error) {
        logger.error('Error en getCargo: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Actualizar un cargo
async function updateCargo(req, res) {
    const { id } = req.params;
    const { name, codigo, status } = req.body;
    try {
        const [updated] = await Cargo.update({ name, codigo, status }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Cargo no encontrado' });
        }
        res.json({ message: 'Cargo actualizado correctamente' });
    } catch (error) {
        logger.error('Error en updateCargo: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

// Eliminar un cargo
async function deleteCargo(req, res) {
    const { id } = req.params;
    try {
        const [updated] = await Cargo.update({ status: Status.INACTIVE }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: 'Cargo no encontrada' });
        }
        res.json({ message: 'Cargo eliminada correctamente' });
    } catch (error) {
        logger.error('Error en deleteCargo: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

async function getCargoDependencia(req, res) {
    const { id } = req.params;
    try {
        const cargo = await Cargo.findOne({
            where: { id },
            include: [{
                model: Area,
                as: 'area',
                include: [{
                    model: Gerencia,
                    as: 'gerencia',
                }, ],
            }, ],
        });

        if (!cargo) {
            return res.status(404).json({ message: 'Cargo no encontrado' });
        }

        const response = {
            cargo: cargo.name,
            area: cargo.area.name,
            gerencia: cargo.area.gerencia.name,
        };

        res.json(response);
    } catch (error) {
        logger.error('Error en getCargoWithAreaAndGerencia: ' + error.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export default {
    getCargos,
    createCargo,
    getCargo,
    updateCargo,
    deleteCargo,
    getCargoDependencia,
};
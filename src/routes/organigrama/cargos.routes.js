import { Router } from 'express';
import cargoController from "../../controllers/organigrama/cargos.controller.js";
import { authenticationToken } from '../../middlewares/authenticate.middleware.js';
import { logAction } from '../../middlewares/logAction.js';

const router = Router();

router.route('/')
    .get(authenticationToken, logAction, cargoController.getCargos)
    .post(authenticationToken, logAction, cargoController.createCargo);

router.route('/:id')
    .get(authenticationToken, logAction, cargoController.getCargo)
    .put(authenticationToken, logAction, cargoController.updateCargo)
    .delete(authenticationToken, logAction, cargoController.deleteCargo);

router.route('/:id/dependencia')
    .get(authenticationToken, cargoController.getCargoDependencia);

export default router;
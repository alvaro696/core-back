import { Router } from 'express';
import gerenciaController from "../../controllers/organigrama/gerencias.controller.js";
import { authenticationToken } from '../../middlewares/authenticate.middleware.js';
import { logAction } from '../../middlewares/logAction.js';

const router = Router();

router.route('/')
    .get(authenticationToken, logAction, gerenciaController.getGerencias)
    .post(authenticationToken, logAction, gerenciaController.createGerencia);

router.route('/:id')
    .get(authenticationToken, logAction, gerenciaController.getGerencia)
    .put(authenticationToken, logAction, gerenciaController.updateGerencia)
    .delete(authenticationToken, logAction, gerenciaController.deleteGerencia);

export default router;
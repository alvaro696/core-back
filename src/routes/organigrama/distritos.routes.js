import { Router } from 'express';
import distritoController from "../../controllers/organigrama/distritos.controller.js";
import { authenticationToken } from '../../middlewares/authenticate.middleware.js';
import { logAction } from '../../middlewares/logAction.js';

const router = Router();

router.route('/')
    .get(authenticationToken, logAction, distritoController.getDistritos)
    .post(authenticationToken, logAction, distritoController.createDistrito);

router.route('/:id')
    .get(authenticationToken, logAction, distritoController.getDistrito)
    .put(authenticationToken, logAction, distritoController.updateDistrito)
    .delete(authenticationToken, logAction, distritoController.deleteDistrito);

export default router;
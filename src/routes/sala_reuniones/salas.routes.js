import { Router } from 'express';
import salaController from "../../controllers/sala_reuniones/salas.controller.js";
import { authenticationToken } from '../../middlewares/authenticate.middleware.js';
import { logAction } from '../../middlewares/logAction.js';

const router = Router();

router.route('/')
    .get(authenticationToken, logAction, salaController.getSalas)
    .post(authenticationToken, logAction, salaController.createSala);

router.route('/:id')
    .get(authenticationToken, logAction, salaController.getSala)
    .put(authenticationToken, logAction, salaController.updateSala)
    .delete(authenticationToken, logAction, salaController.deleteSala);

export default router;
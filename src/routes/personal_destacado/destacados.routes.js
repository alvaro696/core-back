import { Router } from 'express';
import destacadoController from "../../controllers/personal_destacado/destacados.controller.js";
import { authenticationToken } from '../../middlewares/authenticate.middleware.js';
import { logAction } from '../../middlewares/logAction.js';

const router = Router();

router.route('/')
    .post(authenticationToken, logAction, destacadoController.crearDestacados);

router.route('/:trimestre')
    .get(destacadoController.obtenerDestacados);

export default router;
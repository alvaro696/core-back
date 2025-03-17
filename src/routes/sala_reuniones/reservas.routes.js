import { Router } from 'express';
import reservasController from '../../controllers/sala_reuniones/reservas.controller.js';
import { authenticationToken } from '../../middlewares/authenticate.middleware.js';
import { logAction } from '../../middlewares/logAction.js';

const router = Router();

router.route('/')
    .post(authenticationToken, reservasController.crearReserva);

router.route('/sala/:salaId/fecha/:fecha')
    .get(authenticationToken, reservasController.obtenerReservasPorSala);

export default router;
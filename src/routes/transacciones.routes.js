import { Router } from "express";
import TransaccionesController from "../controllers/transacciones.controller.js";
import { authenticationToken } from '../middlewares/authenticate.middleware.js';
import { logAction } from "../middlewares/logAction.js";

const router = Router();

router.route('/').
    get(authenticationToken, logAction, TransaccionesController.obtener).
    post(TransaccionesController.crear);

router.route('/:id')
    .put(TransaccionesController.actualizar)
    .delete(TransaccionesController.eliminar);

export default router;
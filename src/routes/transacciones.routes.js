import { Router } from "express";
import TransaccionesController from "../controllers/transacciones.controller.js";
import { authenticationToken } from '../middlewares/authenticate.middleware.js';

const router = Router();

router.route('/').
    get(authenticationToken, TransaccionesController.obtener).
    post(TransaccionesController.crear);

router.route('/:id')
    .put(TransaccionesController.actualizar)
    .delete(TransaccionesController.eliminar);

export default router;
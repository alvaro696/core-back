import { Router } from "express";
import CuentasController from "../controllers/cuentas.controller.js";
import { authenticationToken } from '../middlewares/authenticate.middleware.js';
import { logAction } from "../middlewares/logAction.js";

const router = Router();

router.route('/').
    get(authenticationToken, logAction, CuentasController.getCuentas).
    post(authenticationToken, logAction, CuentasController.createCuenta);

router.route('/:id')
    .put(CuentasController.updateCuenta)
    .delete(CuentasController.deleteCuenta);

export default router;
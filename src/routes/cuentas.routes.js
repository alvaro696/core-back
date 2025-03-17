import { Router } from "express";
import CuentasController from "../controllers/cuentas.controller.js";
import { authenticationToken } from '../middlewares/authenticate.middleware.js';

const router = Router();

router.route('/').
    get(authenticationToken, CuentasController.getCuentas).
    post(authenticationToken, CuentasController.createCuenta);

router.route('/:id')
    .put(CuentasController.updateCuenta)
    .delete(CuentasController.deleteCuenta);

export default router;
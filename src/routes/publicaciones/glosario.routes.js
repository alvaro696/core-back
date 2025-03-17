import { Router } from 'express';
import glosarioController from "../../controllers/publicaciones/glosario.controller.js";
import { authenticationToken } from '../../middlewares/authenticate.middleware.js';
import { logAction } from '../../middlewares/logAction.js';

const router = Router();

router.route('/')
    .get(glosarioController.getGlosarios)
    .post(authenticationToken, logAction, glosarioController.createGlosario);

router.route('/:id')
    .get(authenticationToken, logAction, glosarioController.getGlosario)
    .put(authenticationToken, logAction, glosarioController.updateGlosario)
    .delete(authenticationToken, logAction, glosarioController.deleteGlosario);

export default router;
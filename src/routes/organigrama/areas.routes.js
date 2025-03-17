import { Router } from 'express';
import areaController from "../../controllers/organigrama/areas.controller.js";
import { authenticationToken } from '../../middlewares/authenticate.middleware.js';
import { logAction } from '../../middlewares/logAction.js';

const router = Router();

router.route('/')
    .get(authenticationToken, logAction, areaController.getAreas)
    .post(authenticationToken, logAction, areaController.createArea);

router.route('/:id')
    .get(authenticationToken, logAction, areaController.getArea)
    .put(authenticationToken, logAction, areaController.updateArea)
    .delete(authenticationToken, logAction, areaController.deleteArea);

export default router;
import { Router } from 'express';
import publicacionesController from "../../controllers/publicaciones/publicaciones.controller.js";
import { authenticationToken } from '../../middlewares/authenticate.middleware.js';
import { logAction } from '../../middlewares/logAction.js';
import upload from "../../utils/multerConfig.js";

const router = Router();

router.route('/')
    .post(authenticationToken, upload.fields([{ name: "imagenAdjunta", maxCount: 1 }, { name: "archivoAdjunto", maxCount: 1 }]), logAction, publicacionesController.crearPublicacion);

router.route('/:tipo')
    .get(publicacionesController.getPublicacion);

/* router.route('/:id')
    .get(authenticationToken, logAction, salaController.getSala)
    .put(authenticationToken, logAction, salaController.updateSala)
    .delete(authenticationToken, logAction, salaController.deleteSala); */

export default router;
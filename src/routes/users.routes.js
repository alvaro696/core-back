import { Router } from 'express'
import usersController from "../controllers/users.controller.js";
import { authenticationToken } from '../middlewares/authenticate.middleware.js';
import { logAction } from '../middlewares/logAction.js';


const router = Router();

router.route('/').get(usersController.getUsers).post(usersController.createUser);

//Si las rutas las rutas no funcionan comentar la siguiente linea
//router.route('/tasks').get(authenticationToken, usersController.getTasksAll);

router.route('/:id')
    .get(authenticationToken, logAction, usersController.getUser)
    .put(authenticationToken, logAction, usersController.updateuser)
    .patch(authenticationToken, logAction, usersController.activateInactivate)
    .delete(authenticationToken, logAction, usersController.deleteUser);

router.route('/:id/tasks').get(authenticationToken, usersController.getTasks);

router.route('/day/:day').get(usersController.getCumpleanieros)
export default router;
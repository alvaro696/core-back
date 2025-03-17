import Log from '../models/log.js';

export const logAction = async(req, res, next) => {
    try {
        console.log('req.user en logAction:', req.user);

        const userId = req.user ? req.user.userId : null;
        const action = `${req.method} ${req.originalUrl}`;

        await Log.create({ userId, action });
    } catch (error) {
        console.error('Error al registrar el log:', error);
    }
    next();
};
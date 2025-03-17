import { Publicacion } from "../../models/publicaciones/publicaciones.js";
import logger from "../../logs/logger.js";
import path from "path";
import { fileURLToPath } from "url";
import { Publicaciones } from "../../constants/publicaciones.js";
import { Area } from "../../models/oraganigrama/areas.js";
import { Gerencia } from "../../models/oraganigrama/gerencias.js";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

async function crearPublicacion(req, res) {
    try {
        const { body, files } = req;

        const imageFile = files.imagenAdjunta ? files.imagenAdjunta[0].filename : null;
        const imagePath = imageFile ? `/uploads/images/${imageFile}` : null;

        const multimediaFile = files.archivoAdjunto ? files.archivoAdjunto[0].filename : null;
        const multimediaPath = multimediaFile ? `/uploads/media/${multimediaFile}` : null;

        const publicacion = await Publicacion.create({
            tipo: body.tipo,
            nombre: body.nombre,
            fechaMaximaExposicion: body.fechaMaximaExposicion,
            link: body.link,
            userId: body.userId,
            areaId: body.areaId,
            imagenAdjunta: imagePath,
            archivoAdjunto: multimediaPath,
        });

        res.status(201).json(publicacion);
    } catch (error) {
        logger.error("Error en crearPublicacion: " + error.message);
        res.status(500).json({ message: "Error del servidor" });
    }
};

async function getPublicacion(req, res) {
    const { tipo } = req.params;
    /*  if (tipo.includes(!Publicaciones)) {
         return res.status(400).json({ message: "Tipo de publicación no válido" });
     } */
    try {
        const publicaciones = await Publicacion.findAll({
            where: {
                tipo: tipo,
            },
            include: [{
                model: Area,
                as: "area",
                include: [{
                    model: Gerencia,
                    as: 'gerencia',
                }, ],
            }, ],
            attributes: [
                "nombre",
                "imagenAdjunta",
                "archivoAdjunto",
                "fechaMaximaExposicion",
                "link",
            ],
        });

        if (!publicaciones || publicaciones.length === 0) {
            return res.status(404).json({ message: "No se encontraron publicaciones" });
        }
        // Formatear la respuesta
        const response = publicaciones.map(publicacion => ({
            nombre: publicacion.nombre,
            imagen: publicacion.imagenAdjunta,
            adjunto: publicacion.archivoAdjunto,
            fecha_maxima: publicacion.fechaMaximaExposicion,
            link: publicacion.link,
            area: publicacion.area.name,
            gerencia: publicacion.area.gerencia.name,
        }));

        res.json(response);
    } catch (error) {
        logger.error("Error en getComunicados: " + error.message);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export default {
    crearPublicacion,
    getPublicacion,
};
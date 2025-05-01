import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { uploadFileS3Function, deleteFileS3Function } from "../../lib/s3/s3.js";
import { variablesDB } from "../../utils/params/const.database.js";
import getConnection from "../../database/connection.mysql.js";

// Guardar imagen en la galería
export const saveGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;
        const linkFile = await uploadFileS3Function({ page: req.body.page, ...file });
        if (linkFile.error) {
            return res.json(responseQueries.error({ message: linkFile.error }));
        }

        if (!id || !linkFile.url) {
            return res.json(responseQueries.error({ message: "Datos incompletos" }));
        }

        const conn = await getConnection();
        const db = variablesDB.landing;

        const updateQuery = `
            UPDATE ${db}.parametersGallery
            SET section_one = JSON_ARRAY_APPEND(section_one, '$', JSON_OBJECT('gallery', ?))
            WHERE id = ?;
        `;

        const [result] = await conn.query(updateQuery, [linkFile.url, id]);

        if (result.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró la galería o no se actualizó" }));
        }

        return res.json(responseQueries.success({ message: "Imagen agregada a la galería correctamente" }));
    } catch (error) {
        console.error("Error al guardar en la galería:", error);
        return res.json(responseQueries.error({ message: "Error interno del servidor" }));
    }
};

// Eliminar imagen en la galería
export const deleteGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { index, url } = req.body;

        if (!id || index === undefined || !url) {
            return res.json(responseQueries.error({ message: "Datos incompletos" }));
        }

        const deleteFiles3 = await deleteFileS3Function(url);
        if (deleteFiles3.error) {
            return res.json(responseQueries.error({ message: deleteFiles3.message }));
        }

        const conn = await getConnection();
        const db = variablesDB.landing;

        const deleteQuery = `
            UPDATE ${db}.parametersGallery
            SET section_one = JSON_REMOVE(section_one, '$[?]')
            WHERE id = ?;
        `;

        const [result] = await conn.query(deleteQuery, [index, id]);

        if (result.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró la galería o el índice no es válido" }));
        }

        return res.json(responseQueries.success({ message: "Imagen eliminada correctamente" }));
    } catch (error) {
        console.error("Error al eliminar la imagen en la galería:", error);
        return res.json(responseQueries.error({ message: "Error interno del servidor" }));
    }
};

// Obtener datos de galería
export const getDataGallery = async (req, res) => {
    const conn = await getConnection();
    const db = variablesDB.landing;
    const query = `
      SELECT id, section_one
      FROM ${db}.parametersGallery`;
    const select = await conn.query(query);
    if (!select) return res.json({
        status: 500,
        message: 'Error obteniendo los datos'
    });
    return res.json(select[0]);
}
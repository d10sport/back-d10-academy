import getConnection from "../../database/connection.mysql.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { deleteFileS3Function, uploadFileS3Function } from "../../lib/s3/s3.js";


// Guardar noticias
export const saveNews = async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const { date, image, title, description } = data;

    const linkFile = await uploadFileS3Function({
        page: req.body.page, ...file
    });
    if (linkFile.error) {
        return res.json(responseQueries.error({
            message: linkFile.error
        }));
    }

    if (!id || !date || !linkFile.url || !title || !description) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const updateQuery = `
            UPDATE ${db}.parametersNews
            SET section_one = JSON_SET(
                section_one,
                CONCAT('$.news.new', JSON_LENGTH(section_one->'$.news') + 1),
                JSON_OBJECT('date', ?, 'image', ?, 'title', ?, 'description', ?)
            )
            WHERE id = ?;
        `;

        const [result] = await conn.query(updateQuery, [date, linkFile.url, title, description, id]);

        if (result.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró la sección o no se actualizó" }));
        }

        return res.json(responseQueries.success({ message: "Noticia agregada correctamente" }));
    } catch (error) {
        console.error("Error al guardar la noticia:", error);
        return res.json(responseQueries.error({ message: "Error interno del servidor" }));
    }
};

// Eliminar noticias
export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { index } = req.body;

        if (!id || index === undefined) {
            return res.json(responseQueries.error({ message: "Datos incompletos" }));
        }

        const conn = await getConnection();
        const db = variablesDB.landing;

        const deleteQuery = `
            UPDATE ${db}.parametersNews
            SET section_one = JSON_REMOVE(section_one, CONCAT('$.news.new', ?))
            WHERE id = ?;
        `;

        const [result] = await conn.query(deleteQuery, [index, id]);

        if (result.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró la noticia o el índice no es válido" }));
        }

        return res.json(responseQueries.success({ message: "Noticia eliminada correctamente" }));
    } catch (error) {
        console.error("Error al eliminar la noticia:", error);
        return res.json(responseQueries.error({ message: "Error interno del servidor" }));
    }
};

// Obtener datos de noticias
export const getDataNews = async (req, res) => {
    const conn = await getConnection();
    const db = variablesDB.landing;
    const query = `
      SELECT id, section_one
      FROM ${db}.parametersNews`;
    const select = await conn.query(query);
    if (!select) return res.json({
        status: 500,
        message: 'Error obteniendo los datos'
    });
    return res.json(select[0]);
}
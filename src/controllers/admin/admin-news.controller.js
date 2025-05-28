import getConnection from "../../database/connection.mysql.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { deleteFileS3Function, uploadFileS3Function } from "../../lib/s3/s3.js";


// Guardar noticias
export const saveNews = async (req, res) => {
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const { title, description, image, date, category_id } = data;

    const linkFile = await uploadFileS3Function({ page: req.body.page, ...file });
    if (linkFile.error) {
        return res.json(responseQueries.error({ message: linkFile.error }));
    }

    if (!title || !description || !linkFile.url || !date || !category_id) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    const conn = await getConnection();
    const db = variablesDB.landing;

    const insert = await conn.query(
        `INSERT INTO ${db}.news (title, description, image, date, category_id)
        VALUES (?, ?, ?, ?, ?)`,
        [title, description, linkFile.url, date, category_id]
    );

    if (!insert) return res.json(responseQueries.error({ message: "Error al crear curso" }));

    return res.json(responseQueries.success({ message: "Curso creado con éxito" }));
};

// Eliminar noticias
export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { url } = req.body;

        if (!id || !url) {
            return res.json(responseQueries.error({ message: "Datos incompletos" }));
        }

        const deleteFiles3 = await deleteFileS3Function(url);
        if (deleteFiles3.error) {
            return res.json(responseQueries.error({ message: deleteFiles3.message }));
        }

        const conn = await getConnection();
        const db = variablesDB.landing;

        const deleteQuery = await conn.query(
            `DELETE FROM ${db}.news WHERE id = ?;`,
            [id]
        );

        if (!deleteQuery) return res.json(responseQueries.error({ message: "Error al eliminar noticia" }));

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
      SELECT id, title, description, image, DATE_FORMAT(date, '%Y-%m-%d') as date, category_id
      FROM ${db}.news`;
    const select = await conn.query(query);
    if (!select) return res.json({
        status: 500,
        message: 'Error obteniendo los datos'
    });
    return res.json(select[0]);
}
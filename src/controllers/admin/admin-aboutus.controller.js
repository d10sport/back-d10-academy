import getConnection from "../../database/connection.mysql.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { deleteFileS3Function, uploadFileS3Function } from "../../lib/s3/s3.js";

// Actualizar sección de Conócenos
export const updateAdminAboutUsConocenos = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!id || !title || !description) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersAboutUs
             SET section_one = JSON_SET(section_one,
                '$.title', ?,
                '$.description', ?)
             WHERE id = ?`,
            [title, description, id]
        );

        if (update.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró el registro" }));
        }

        return res.json(responseQueries.success({ message: "Datos actualizados con éxito" }));
    } catch (error) {
        return res.json(responseQueries.error({ message: "Error al actualizar los datos", error }));
    }
};


// Actualizar sección de Fundador
export const updateAdminAboutUsFundador = async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const { title1, title2, bg_photo, subtitle, description } = data;

    const deleteFiles3 = await deleteFileS3Function(bg_photo);
    if (deleteFiles3.error) {
        return req.json(responseQueries.error({ message: deleteFiles3.message }));
    }

    const linkFile = await uploadFileS3Function({
        page: req.body.page, ...file
    });
    if (linkFile.error) {
        return res.json(responseQueries.error({
            message: linkFile.error
        }));
    }

    if (!id || !title1 || !title2 || !linkFile.url || !subtitle || !description) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersAboutUs
             SET section_two = JSON_SET(section_two,
                '$.title1', ?,
                '$.title2', ?,
                '$.bg_photo', ?,
                '$.subtitle', ?,
                '$.description', ?)
             WHERE id = ?`,
            [title1, title2, linkFile.url, subtitle, description, id]
        );

        if (update.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró el registro" }));
        }

        return res.json(responseQueries.success({ message: "Datos actualizados con éxito" }));
    } catch (error) {
        return res.json(responseQueries.error({ message: "Error al actualizar los datos", error }));
    }
};


// Actualizar sección de Objetivos
export const updateAdminAboutUsObjetivos = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!id || !title || !description) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersAboutUs
             SET section_three = JSON_SET(section_three,
                '$.title', ?,
                '$.description', ?)
             WHERE id = ?`,
            [title, description, id]
        );

        if (update.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró el registro" }));
        }

        return res.json(responseQueries.success({ message: "Datos actualizados con éxito" }));
    } catch (error) {
        return res.json(responseQueries.error({ message: "Error al actualizar los datos", error }));
    }
};


// Actualizar sección de Misión
export const updateAdminAboutUsMision = async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const { title, description, bg_photo } = data;

    const deleteFiles3 = await deleteFileS3Function(bg_photo);
    if (deleteFiles3.error) {
        return res.json(responseQueries.error({ message: deleteFiles3.message }));
    }

    const linkFile = await uploadFileS3Function({ page: req.body.page, ...file });
    if (linkFile.error) {
        return res.json(responseQueries.error({ message: linkFile.error }));
    }

    if (!id || !title || !linkFile.url || !description) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersAboutUs
             SET section_four = JSON_SET(section_four,
                '$.title', ?,
                '$.bg_photo', ?,
                '$.description', ?)
             WHERE id = ?`,
            [title, linkFile.url, description, id]
        );

        if (update.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró el registro" }));
        }

        return res.json(responseQueries.success({ message: "Datos actualizados con éxito" }));
    } catch (error) {
        return res.json(responseQueries.error({ message: "Error al actualizar los datos", error }));
    }
};

// Actualizar sección de Visión
export const updateAdminAboutUsVision = async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const { title, description, bg_photo } = data;

    const deleteFiles3 = await deleteFileS3Function(bg_photo);
    if (deleteFiles3.error) {
        return res.json(responseQueries.error({
            message: deleteFileS3.message
        }));
    }

    const linkFile = await uploadFileS3Function({
        page: req.body.page, ...file
    });
    if (linkFile.error) {
        return res.json(responseQueries.error({
            message: linkFile.error
        }));
    }

    if (!id || !title || !linkFile.url || !description) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersAboutUs
             SET section_six = JSON_SET(section_six,
                '$.title', ?,
                '$.bg_photo', ?,
                '$.description', ?)
             WHERE id = ?`,
            [title, linkFile.url, description, id]
        );

        if (update.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró el registro" }));
        }

        return res.json(responseQueries.success({ message: "Datos actualizados con éxito" }));
    } catch (error) {
        return res.json(responseQueries.error({ message: "Error al actualizar los datos", error }));
    }
};

// Obtener datos de quienes somos
export const getDataAboutUs = async (req, res) => {
    const conn = await getConnection();
    const db = variablesDB.landing;
    const query = `
      SELECT id, section_one, section_two, section_three, section_four, section_five, section_six
      FROM ${db}.parametersAboutUs`;
    const select = await conn.query(query);
    if (!select) return res.json({
        status: 500,
        message: 'Error obtendiendo los datos'
    });
    return res.json(select[0]);
}
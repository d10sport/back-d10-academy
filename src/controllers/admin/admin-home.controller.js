import getConnection from "../../database/connection.mysql.js";
import { generateToken } from "../../utils/token/handle-token.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { deleteFileS3Function, uploadFileS3Function } from "../../lib/s3/s3.js";

// Actualizar sección de Inicio
export const updateAdminHome = async (req, res) => {
    const { id } = req.params;
    const file = req.files;
    const data = JSON.parse(req.body.data);
    const { slogan, company, bg_photo, slogan_two, bg_photo_res, slogan_three } = data;

    const deleteFiles3BgPhoto = await deleteFileS3Function(bg_photo);
    if (deleteFiles3BgPhoto.error) {
        return res.json(responseQueries.error({
            message: deleteFiles3BgPhoto.message
        }));
    }

    const deleteFiles3BgPhotoRes = await deleteFileS3Function(bg_photo_res);
    if (deleteFiles3BgPhotoRes.error) {
        return res.json(responseQueries.error({
            message: deleteFiles3BgPhotoRes.message
        }));
    }

    const linkFileBgPhoto = await uploadFileS3Function({
        page: req.body.page, ...file
    });
    if (linkFileBgPhoto.error) {
        return res.json(responseQueries.error({
            message: linkFileBgPhoto.error
        }));
    }

    const linkFileBgPhotoRes = await uploadFileS3Function({
        page: req.body.page, ...file
    });
    if (linkFileBgPhotoRes.error) {
        return res.json(responseQueries.error({
            message: linkFileBgPhotoRes.error
        }));
    }

    if (!id || !slogan || !company || !linkFileBgPhoto.url || !slogan_two || !linkFileBgPhotoRes.url || !slogan_three) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersHome
             SET section_one = JSON_SET(section_one,
                '$.slogan', ?,
                '$.company', ?,
                '$.bg_photo', ?,
                '$.slogan_two', ?,
                '$.bg_photo_res', ?,
                '$.slogan_three', ?)
             WHERE id = ?`,
            [slogan, company, linkFileBgPhoto.url, slogan_two, linkFileBgPhotoRes.url, slogan_three, id]
        );

        if (update.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró el registro" }));
        }

        return res.json(responseQueries.success({ message: "Datos actualizados con éxito" }));
    } catch (error) {
        return res.json(responseQueries.error({ message: "Error al actualizar los datos", error }));
    }
};

// Actualizar sección de Nosotros
export const updateAdminNosotros = async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const { title, bg_photo, description } = data;

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
            `UPDATE ${db}.parametersHome
             SET section_two = JSON_SET(section_two,
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


// Actualizar sección de Comercial
export const updateAdminComercial = async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const { video } = data;

    const deleteFiles3 = await deleteFileS3Function(video);
    if (deleteFiles3.error) {
        return res.json(responseQueries.error({ message: deleteFiles3.message }));
    }

    const linkFile = await uploadFileS3Function({ page: req.body.page, ...file });
    if (linkFile.error) {
        return res.json(responseQueries.error({ message: linkFile.error }));
    }

    if (!id || !linkFile.url) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersHome
             SET section_three = JSON_SET(section_three,
                '$.video', ?)
             WHERE id = ?`,
            [linkFile.url, id]
        );

        if (update.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró el registro" }));
        }

        return res.json(responseQueries.success({ message: "Datos actualizados con éxito" }));
    } catch (error) {
        return res.json(responseQueries.error({ message: "Error al actualizar los datos", error }));
    }
};

// Actualizar sección de Noticias
export const updateAdminNews = async (req, res) => {
    const { id } = req.params;
    const { h1, title, description } = req.body;

    if (!id || !h1 || !title || !description) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersHome
             SET section_four = JSON_SET(section_four,
                '$.news.h1', ?,
                '$.news.title', ?,
                '$.news.description', ?)
             WHERE id = ?`,
            [h1, title, description, id]
        );

        if (update.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró el registro" }));
        }

        return res.json(responseQueries.success({ message: "Datos actualizados con éxito" }));
    } catch (error) {
        return res.json(responseQueries.error({ message: "Error al actualizar los datos", error }));
    }
};

// Actualizar sección de Academia
export const updateAdminAcademia = async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const { link, title_1, title_2, bg_photo, text_link } = data;

    const deleteFiles3 = await deleteFileS3Function(bg_photo);
    if (deleteFiles3.error) {
        return res.json(responseQueries.error({ message: deleteFiles3.message }));
    }

    const linkFile = await uploadFileS3Function({ page: req.body.page, ...file });
    if (linkFile.error) {
        return res.json(responseQueries.error({ message: linkFile.error }));
    }

    if (!id || !link || !title_1 || !title_2 || !linkFile.url || !text_link) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersHome
             SET section_five = JSON_SET(section_five,
                '$.link', ?,
                '$.title_1', ?,
                '$.title_2', ?,
                '$.bg_photo', ?,
                '$.text_link', ?)
             WHERE id = ?`,
            [link, title_1, title_2, linkFile.url, text_link, id]
        );

        if (update.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró el registro" }));
        }

        return res.json(responseQueries.success({ message: "Datos actualizados con éxito" }));
    } catch (error) {
        return res.json(responseQueries.error({ message: "Error al actualizar los datos", error }));
    }
};

// Actualizar sección de Aliados
export const updateAdminAliados = async (req, res) => {
    const { id } = req.params;
    const { tile } = req.body;

    if (!id || !tile) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersHome
             SET section_six = JSON_SET(section_six,
                '$.tile', ?)
             WHERE id = ?`,
            [tile, id]
        );

        if (update.affectedRows === 0) {
            return res.json(responseQueries.error({ message: "No se encontró el registro" }));
        }

        return res.json(responseQueries.success({ message: "Datos actualizados con éxito" }));
    } catch (error) {
        return res.json(responseQueries.error({ message: "Error al actualizar los datos", error }));
    }
};

// Obtener datos de Inicio
export const getDataHome = async (req, res) => {
    const conn = await getConnection();
    const db = variablesDB.landing;
    const query = `
      SELECT id, section_one, section_two, section_three, section_four, section_five, section_six
      FROM ${db}.parametersHome`;

    const select = await conn.query(query);

    if (!select || select.length === 0) {
        return res.json(responseQueries.error({ message: "Error obteniendo los datos" }));
    }

    const encryptedData = await generateToken({ sub: select[0][0].id, data: select[0] });

    return res.json(responseQueries.success({ data: encryptedData }));
};

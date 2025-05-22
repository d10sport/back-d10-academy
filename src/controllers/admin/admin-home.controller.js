import getConnection from "../../database/connection.mysql.js";
import { generateToken } from "../../utils/token/handle-token.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { deleteFileS3Function, uploadFileS3Function } from "../../lib/s3/s3.js";

// Actualizar sección de Inicio
export const updateAdminHome = async (req, res) => {
    const { id } = req.params;
    const files = req.files || [];
    const data = JSON.parse(req.body.data);
    let { slogan, company, bg_photo, slogan_two, bg_photo_res, slogan_three } = data;

    let bgPhotoFile = null;
    let bgPhotoResFile = null;

    const fileTypes = req.body.fileType;
    const fileArray = Array.isArray(fileTypes) ? fileTypes : [fileTypes];

    fileArray.forEach((type, index) => {
        if (type === 'bg_photo') {
            bgPhotoFile = files[index];
        } else if (type === 'bg_photo_res') {
            bgPhotoResFile = files[index];
        }
    });

    if (bgPhotoFile) {
        const deleted = await deleteFileS3Function(bg_photo);
        if (deleted.error) return res.json(responseQueries.error({ message: deleted.message }));
        const uploaded = await uploadFileS3Function({
            page: req.body.page,
            ...bgPhotoFile
        });
        if (uploaded.error) return res.json(responseQueries.error({ message: uploaded.message }));

        bg_photo = uploaded.url;
    }

    if (bgPhotoResFile) {
        const deleted = await deleteFileS3Function(bg_photo_res);
        if (deleted.error) return res.json(responseQueries.error({ message: deleted.message }));

        const uploaded = await uploadFileS3Function({
            page: req.body.page,
            ...bgPhotoResFile
        });
        if (uploaded.error) return res.json(responseQueries.error({ message: uploaded.message }));

        bg_photo_res = uploaded.url;
    }

    if (!id || !slogan || !company || !bg_photo || !slogan_two || !bg_photo_res || !slogan_three) {
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
            [slogan, company, bg_photo, slogan_two, bg_photo_res, slogan_three, id]
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
    const data = JSON.parse(req.body.data);
    const { title, description } = data;

    if (!id || !title || !description) {
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

// Actualizar sección de Comercial
export const updateAdminComercial = async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const { title, video, description } = data;

    const deleteFiles3 = await deleteFileS3Function(video);
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
             SET section_three = JSON_SET(section_three,
                '$.title', ?,
                '$.video', ?,
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

// Actualizar sección de Noticias
export const updateAdminNews = async (req, res) => {
    const { id } = req.params;
    const { label, title1, title2, title3, description } = req.body;

    if (!id || !label || !title1 || !title2 || !title3 || !description) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersHome
             SET section_four = JSON_SET(section_four,
                '$.news.label', ?,
                '$.news.title1', ?,
                '$.news.title2', ?,
                '$.news.title3', ?,
                '$.news.description', ?)
             WHERE id = ?`,
            [label, title1, title2, title3, description, id]
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
    const { link, logo, title, description } = data;

    const deleteFiles3 = await deleteFileS3Function(logo);
    if (deleteFiles3.error) {
        return res.json(responseQueries.error({ message: deleteFiles3.message }));
    }

    const linkFile = await uploadFileS3Function({ page: req.body.page, ...file });
    if (linkFile.error) {
        return res.json(responseQueries.error({ message: linkFile.error }));
    }

    if (!id || !link || !linkFile.url || !title || !description) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.landing;

        const update = await conn.query(
            `UPDATE ${db}.parametersHome
             SET section_five = JSON_SET(section_five,
                '$.link', ?,
                '$.logo', ?,
                '$.title', ?,
                '$.description', ?)
             WHERE id = ?`,
            [link, linkFile.url, title, description, id]
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

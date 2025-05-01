import getConnection from "../../database/connection.mysql.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { deleteFileS3Function, uploadFileS3Function } from "../../lib/s3/s3.js";


// Obtener todas las clases
export const getAdminClass = async (req, res) => {
    const conn = await getConnection();
    const db = variablesDB.academy;
    const select = await conn.query(`SELECT * FROM ${db}.course_user`);
    if (!select) return res.json({
        status: 500,
        message: 'Error obteniendo las clases',
    });
    return res.json(select[0]);
}


// Guardar una clase
export const saveAdminClass = async (req, res) => {
    const conn = await getConnection();
    const db = variablesDB.academy;
    if (!conn) return res.json({ message: "Error en la conexión a la base de datos" });

    try {
        await conn.beginTransaction();

        const file = req.file;
        const data = JSON.parse(req.body.data);
        const { id_course, class_title, class_description, class_content } = data;

        // const deleteFiles3 = await deleteFileS3Function(class_content);
        // if (deleteFiles3.error) {
        //     return res.json(responseQueries.error({ message: deleteFiles3.message }));
        // }

        const linkFile = await uploadFileS3Function({ page: req.body.page, ...file });
        if (linkFile.error) {
            return res.json(responseQueries.error({ message: linkFile.error }));
        }

        if (!id_course || !class_title || !class_description || !linkFile.url) {
            throw new Error("Datos incompletos");
        }

        const classContentJSON = JSON.stringify({ video: linkFile.url });

        const [insertContent] = await conn.query(
            `INSERT INTO ${db}.content_course (id_course, class_title, class_description, class_content) VALUES (?, ?, ?, ?)`,
            [id_course, class_title, class_description, classContentJSON]
        );

        if (!insertContent.insertId) throw new Error("Error al insertar en content_course");

        const lastContentId = insertContent.insertId;

        const [insertClass] = await conn.query(
            `INSERT INTO ${db}.class_course (id_course, id_content) VALUES (?, ?)`,
            [id_course, lastContentId]
        );

        if (!insertClass.affectedRows) throw new Error("Error al insertar en class_course");

        await conn.commit();
        return res.json(responseQueries.success({ message: "Clase creada con éxito" }));
    } catch (error) {
        await conn.rollback();
        return res.json(responseQueries.error({ message: error.message || "Error al crear la clase" }));
    }
};

// Eliminar una clase
export const deleteAdminClass = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            status: 400,
            message: 'El ID es obligatorio'
        });
    }

    try {
        const conn = await getConnection();
        const db = variablesDB.academy;

        const [result] = await conn.query(`DELETE FROM ${db}.content_course WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Contenido no encontrado'
            });
        }

        return res.json({
            status: 200,
            message: `Contenido #${id} eliminado correctamente`
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Error al eliminar el contenido',
            error: error.message
        });
    }
};

// Actualizar una clase
// export const updateAdminClass = async (req, res) => {
//     const { id } = req.params;
//     const { class_title, class_description, class_content } = req.body;

//     if (!id || !class_title || !class_description || !class_content) {
//         return res.json(responseQueries.error({ message: "Datos incompletos" }));
//     }

//     const classContentJSON = JSON.stringify({ video: class_content });

//     try {
//         const conn = await getConnection();
//         const db = variablesDB.academy;

//         const update = await conn.query(
//             `UPDATE ${db}.content_course SET class_title = ?, class_description = ?, class_content = ? WHERE id = ?`,
//             [class_title, class_description, classContentJSON, id]
//         );

//         if (update.affectedRows === 0) {
//             return res.json(responseQueries.error({ message: "No se encontró el contenido" }));
//         }

//         return res.json(responseQueries.success({ message: "Contenido actualizado con éxito" }));
//     } catch (error) {
//         return res.json(responseQueries.error({ message: "Error al actualizar contenido", error }));
//     }
// };

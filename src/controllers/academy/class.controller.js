import getConnection from "../../database/connection.mysql.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";

// Obtener todas las clases
export const getClassMenu = async (req, res) => {
    const { id_course } = req.query;
    const conn = await getConnection();
    const db = variablesDB.academy;
    const select = await conn.query(`SELECT co.id_content AS class_id, cc.class_title, cc.class_description, cc.class_content FROM ${db}.content_course cc INNER JOIN ${db}.class_course co ON co.id_content = cc.id WHERE cc.id_course = ?`, [id_course]);
    if (!select) return res.json(responseQueries.error({ message: "Error obteniendo las clases" }));
    return res.json(responseQueries.success({ data: select[0] }));
}

// Obtener contenido de una clase
export const getClassContent = async (req, res) => {
    const { id } = req.query;
    const conn = await getConnection();
    const db = variablesDB.academy;
    const select = await conn.query(`SELECT * FROM ${db}.content_course WHERE id = ?`, [id]);
    if (!select) return res.json(responseQueries.error({ message: "Error obteniendo el contenido de las clases" }));
    return res.json(responseQueries.success({ data: select[0] }));
}

// Obtener comentarios de una clase
export const getClassComments = async (req, res) => {
    const { id_class } = req.query;
    const conn = await getConnection();
    const db = variablesDB.academy;

    const select = await conn.query(
        `SELECT cm.comment AS comentario,
        COALESCE(
            CONCAT(au.first_names, ' ', au.last_names),
            CONCAT(ca.first_names, ' ', ca.last_names),
            cu.name_club,
            'Usuario Desconocido'
        ) AS nombre,
        lu.email AS correo
        FROM ${db}.comments_course cm
        LEFT JOIN ${db}.login_users lu ON lu.id_user = cm.id_user
        LEFT JOIN ${db}.athlete au ON au.id_user = lu.id_user
        LEFT JOIN ${db}.coach ca ON ca.id_user = lu.id_user
        LEFT JOIN ${db}.club cu ON cu.id_user = lu.id_user
        WHERE cm.id_class = ?`,
        [id_class]
    );

    if (!select) return res.json(responseQueries.error({ message: "Error obteniendo los comentarios de la clase" }));
    return res.json(responseQueries.success({ data: select[0] }));
};

// Guardar comentario de una clase
export const saveClassComment = async (req, res) => {
    const { id_class, comment, id_user } = req.body;
    if (!id_class || !comment || !id_user) {
        return res.json(responseQueries.error({ message: "Datos incompletos" }));
    }
    const conn = await getConnection();
    const db = variablesDB.academy;
    const insert = await conn.query(
        `INSERT INTO ${db}.comments_course (id_class, id_user, comment) VALUES (?, ?, ?)`,
        [id_class, id_user, comment]
    );
    if (!insert) return res.json(responseQueries.error({ message: "Error al guardar comentario" }));
    return res.json(responseQueries.success({ message: "Comentario publicado" }));
};
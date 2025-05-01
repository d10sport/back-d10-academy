import getConnection from "../../database/connection.mysql.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";

export const getAllCountUsersWithAdmin = async (req, res) => {
    const conn = await getConnection();
    const db = variablesDB.academy;
    const select = await conn.query(`SELECT rs.description_role AS rol,
    COUNT(ru.id_user) AS count_users FROM ${db}.role_system rs
    LEFT JOIN ${db}.role_user ru ON rs.id = ru.id_role
    GROUP BY rs.description_role
    ORDER BY count_users DESC;`);
    if (!select) return res.json(responseQueries.error({ message: "Error obteniendo los registros" }));
    return res.json(responseQueries.success({ data: select[0] }));
}

export const getAllCountUsersWithoutAdmin = async (req, res) => {
    const conn = await getConnection();
    const db = variablesDB.academy;
    const select = await conn.query(`SELECT rs.description_role AS rol,
    COUNT(ru.id_user) AS count_users FROM ${db}.role_system rs
    LEFT JOIN ${db}.role_user ru ON rs.id = ru.id_role
    WHERE rs.name_role != 'admin'
    GROUP BY rs.description_role
    ORDER BY count_users DESC;`);
    if (!select) return res.json(responseQueries.error({ message: "Error obteniendo los registros" }));
    return res.json(responseQueries.success({ data: select[0] }));
}

export const getAllRegistersVerifiedByDate = async (req, res) => {
    const conn = await getConnection();
    const db = variablesDB.academy;
    const select = await conn.query(`SELECT YEAR(verified_at) AS year, MONTH(verified_at) AS month, COUNT(*) AS registered_users
        FROM ${db}.login_users WHERE verified_at IS NOT NULL
        GROUP BY YEAR(verified_at), MONTH(verified_at)
        ORDER BY year DESC, month DESC;`);
    if (!select) return res.json(responseQueries.error({ message: "Error obteniendo los registros" }));
    return res.json(responseQueries.success({ data: select[0] }));
}

export const getUsersFromClub = async (req, res) => {
    const { id_club } = req.params;
    const conn = await getConnection();
    const db = variablesDB.academy;
    const select = await conn.query(`SELECT id_user ID, first_names Nombre, last_names Apellido, gender Sexo, city Ciudad,
    contact Contacto, mail Correo, social_networks Redes
    from ${db}.coach where id_club = ?`, [id_club]);
    if (!select) return res.json(responseQueries.error({ message: "Error obteniendo los usuarios" }));
    return res.json(responseQueries.success({ data: select[0] }));
}

export const getAllUsers = async (req, res) => {
    const conn = await getConnection();
    const db = variablesDB.academy;
    const select = await conn.query(`SELECT id_user, first_names, last_names, gender, city, contact, mail, social_networks
    FROM ${db}.athlete
    UNION
    SELECT id_user, first_names, last_names, gender, city, contact, mail, social_networks
    FROM ${db}.coach
    UNION
    SELECT id_user, president AS first_names, name_club AS last_names, NULL AS gender, city, contact, mail, social_networks 
    FROM ${db}.club;`, []);
    if (!select) return res.json(responseQueries.error({ message: "Error obteniendo los usuarios" }));
    return res.json(responseQueries.success({ data: select[0] }));
}
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { variablesDB } from "../../utils/params/const.database.js";
import getConnection from "../../database/connection.mysql.js";

// Buscar cualquier admin
export async function searchAdminAvailable() {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`SELECT ru.id_user, ru.id_role, rs.name_role, au.first_names, au.last_names, au.gender, au.email
    FROM ${db}.role_user ru
    INNER JOIN ${db}.admin_user au ON au.id_user = ru.id_user
    INNER JOIN ${db}.role_system rs ON rs.id = ru.id_role;
  `);
  if (!select) return responseQueries.error({ message: "Error search admin" });
  return responseQueries.success({ data: select[0] });
}

// Function para filtrar administrador por id_user
export async function getAdminByIdUserFunction(id) {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`SELECT id, id_user, first_names, last_names, gender, email FROM ${db}.admin_user WHERE id_user = ?`, [id]);
  if (!select) return responseQueries.error({ message: "Error obteniendo administrador" });
  return responseQueries.success({ data: select[0] });
}


// Obtener todos los administradores
export const getAdminAcademy = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`SELECT * FROM ${db}.admin_user`);
  if (!select) return responseQueries.error({ message: "Error obteniendo los administradores" });
  return responseQueries.success({ data: select[0] });
}
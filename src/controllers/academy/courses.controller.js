import getConnection from "../../database/connection.mysql.js";
import { variablesDB } from "../../utils/params/const.database.js";

// Obtener datos de cursos
export const getCoursesAcademy = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`SELECT * FROM ${db}.course_user`);
  if (!select) return res.json({
    status: 500,
    message: 'Error obteniendo los cursos',
  });
  return res.json(select[0]);
}


import { createSolitudLoginUser, createSolitudeRegisterUser, validateNotRegisterMail, searchLoginUserById } from "./users.controller.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { createRoleUser, getRoleByIdRole } from "./role.controller.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { generateToken } from "../../utils/token/handle-token.js";
import { sendEmailFunction } from "../../lib/api/email.api.js";
import getConnection from "../../database/connection.mysql.js";
import { getClubByIdFunction } from "./club.controller.js";

// Obtener todos los entrenadores
export const getCoach = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`SELECT * FROM ${db}.coach`);
  if (!select) return res.json(responseQueries.error({ message: "Error obteniendo el entrenador" }));
  return res.json(responseQueries.success({ data: select[0] }));
}

// Filtrar entrenador por id
export const getCoachById = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const id = req.params.id;
  const select = await conn.query(`SELECT * FROM ${db}.coach WHERE id = ?`, [id]);
  if (!select) return res.json(responseQueries.error({ message: "Error obteniendo el entrenador" }));
  return res.json(responseQueries.success({ data: select[0] }));
}

// Funcion para filtrar entrenador por id
export async function getCoachByIdFunction(id) {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`
    SELECT id_club, first_names, last_names, gender, date_birth, country, city, contact, mail, social_networks, academic_level, licenses_obtained, other
    FROM ${db}.coach WHERE id_user = ?`, [id]);
  if (!select) return responseQueries.error({ message: "Error obteniendo el entrenador" });
  return responseQueries.success({ data: select[0] });
}

// Funcion para eliminar entrenador por id
export async function deleteCoachByIdFunction(id) {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`DELETE FROM ${db}.coach WHERE id_user = ?`, [id]);
  if (!select) return responseQueries.error({ message: "Error eliminando el entrenador" });
  return responseQueries.success({ data: select[0] });
}

// Filtrar entrenador
export const searchCoachFilter = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const filter = req.params.filter;
  const select = await conn.query(`SELECT id, first_names, last_names FROM ${db}.coach WHERE first_names LIKE '%${filter}%' OR last_names LIKE '%${filter}%'`);
  if (!select) return res.json(responseQueries.error({ message: "Error filtrando el entrenador" }));
  return res.json(responseQueries.success({ data: select[0] }));
}

// Insertar Entrenador
export const registerCoach = async (req, res) => {
  const pool = await getConnection()
  const db = variablesDB.academy
  const { id_club, first_names, last_names, gender, date_birth, country, city, contact, mail, social_networks, academic_level, licenses_obtained, other, role } = req.body
  try {
    const existMail = await validateNotRegisterMail(mail);
    if (existMail.success) {
      return res.json(responseQueries.error({ message: existMail.message }))
    }
    const insertLogin = await createSolitudLoginUser({ email: mail })
    if (insertLogin.success) {
      let club = await getClubByIdFunction(id_club);
      if (club.error) {
        return res.json(responseQueries.error({ message: "Error obteniendo el club" }));
      }
      const insert = await pool.query(`INSERT INTO ${db}.coach
      (id_user, id_club, first_names, last_names, gender, date_birth, country, city, contact, mail, social_networks, academic_level, licenses_obtained, other)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [insertLogin.data.insertId, id_club, first_names, last_names, gender, date_birth, country, city, contact, mail, JSON.stringify(social_networks), academic_level, licenses_obtained, other])
      if (insert[0].affectedRows === 0) {
        return res.json(responseQueries.error({ message: "Registros no insertados" }))
      }
      const insertRole = await createRoleUser({ id_user: insertLogin.data.insertId, id_role: role.role_id })
      if (insertRole.error) {
        return res.json(responseQueries.error({ message: insertRole.message }))
      }
      const roleCoach = await getRoleByIdRole(role.role_id);
      if (roleCoach.error) {
        return res.json(responseQueries.error({ message: roleAdmin.message }))
      }
      let nameComplete = `${first_names.charAt(0).toUpperCase() + first_names.slice(1)} ${last_names.charAt(0).toUpperCase() + last_names.slice(1)}`
      let username = mail;
      const insertSolitudeRegister = await createSolitudeRegisterUser({ id_user: insertLogin.data.insertId, username: username })
      if (insertSolitudeRegister.success) {
        const loginClub = await searchLoginUserById({ id: club.data[0].id_user })
        if (loginClub.error) {
          return res.json(responseQueries.error({ message: loginClub.message, status: loginClub.status, token: null, user: null }))
        }
        const tokenUsername = await generateToken({
          sub: loginClub.data[0].id_user,
          username: loginClub.data[0].username
        })
        const tokenPassword = await generateToken({
          sub: loginClub.data[0].id_user,
          password: loginClub.data[0].password
        })
        const tokenRole = await generateToken({
          sub: loginClub.data[0].id_user,
          role_user: role
        })
        const sendMailUser = await sendEmailFunction({ name: nameComplete, username: undefined, password: undefined, email: username, type: 'register_user_coach', role_user: role.name_role })
        const sendMailClub = await sendEmailFunction({ name: { email: loginClub.data[0].username, name: club.data[0].name_club, username: tokenUsername, password: tokenPassword, role_user: tokenRole }, username: nameComplete, password: undefined, email: username, type: 'register_club', role_user: role.name_role })
        return res.json(responseQueries.success({
          message: "Entrenador registrado correctamente",
          status: 200,
          data: [{ athleteId: insert[0].insertId, loginId: insertLogin.data.insertId, solitudeId: insertSolitudeRegister.data.insertId, sendMailUser: sendMailUser, sendMailClub: sendMailClub }]
        }))
      }
      return res.json(responseQueries.error({ message: insertSolitudeRegister.message }))
    } else {
      return res.json(responseQueries.error({ message: insertLogin.message }))
    }
  } catch (error) {
    res.json(responseQueries.error({
      message: error?.message || "Error insertando",
    }))
  }
}
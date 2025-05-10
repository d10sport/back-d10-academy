import { createSolitudLoginUser, createSolitudeRegisterUser, validateNotRegisterMail, searchLoginUserById } from "./users.controller.js";
import { saveCategoriesAvailablesClubFunction } from "./solitud_register.controller.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { searchAdminAvailable } from "../admin/admin.controller.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { generateToken } from "../../utils/token/handle-token.js";
import getConnection from "../../database/connection.mysql.js";
import { sendEmailFunction } from "../../lib/api/email.api.js";
import { createRoleUser } from "./role.controller.js";

// Obtener todos los clubes
export const getClub = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`SELECT * FROM ${db}.club`);
  if (!select) return res.json(responseQueries.error({ message: "Error obteniendo los clubes" }));
  return res.json(responseQueries.success({ data: select[0] }));
}

// Filtrar club por id
export const getClubById = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const id = req.params.id;
  const select = await conn.query(`SELECT * FROM ${db}.club WHERE id = ?`, [id]);
  if (!select) return res.json(responseQueries.error({ message: "Error obteniendo el club" }));
  return res.json(responseQueries.success({ data: select[0] }));
}

// Function para filtrar club por id
export async function getClubByIdFunction(id) {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`SELECT id, id_user, name_club, mail, city, country, president FROM ${db}.club WHERE id = ?`, [id]);
  if (!select) return responseQueries.error({ message: "Error obteniendo el club" });
  return responseQueries.success({ data: select[0] });
}

// Funcion para eliminar club por id
export async function deleteClubByIdFunction(id) {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`DELETE FROM ${db}.club WHERE id_user = ?`, [id]);
  if (!select) return responseQueries.error({ message: "Error eliminando el club" });
  return responseQueries.success({ data: select[0] });
}

// Function para filtrar club por id_user
export async function getClubByIdUserFunction(id) {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`SELECT id, id_user, name_club, mail, city, country, president FROM ${db}.club WHERE id_user = ?`, [id]);
  if (!select) return responseQueries.error({ message: "Error obteniendo el club" });
  return responseQueries.success({ data: select[0] });
}

// Filtrar Club
export const searchClubFilter = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const filter = req.params.filter;
  const select = await conn.query(`SELECT id, name_club, president FROM ${db}.club WHERE name_club LIKE '%${filter}%'`);
  if (!select) return res.json(responseQueries.error({ message: "Error filtrando el club" }));
  return res.json(responseQueries.success({ data: select[0] }));
}

export async function saveCategoriesClub(data, insertLogin) {
  for (const category of data) {
    const insertCat = await saveCategoriesAvailablesClubFunction({
      id_club: insertLogin,
      id_sub_category: category.id
    });

    if (insertCat.error) {
      return responseQueries.error({ message: insertCat.message });
    }
  }

  return responseQueries.success({
    message: "Registro exitoso",
    status: 200,
  });
}

// Registro de club
export const registerClub = async (req, res) => {
  const pool = await getConnection()
  const db = variablesDB.academy
  const { name_club, date_founded, country, city, president, comet, contact, mail, social_networks, website, number_athletes, categories, local_league, national_tournament, number_coaches, assistants, venues, role } = req.body
  try {
    const existMail = await validateNotRegisterMail(mail);
    if (existMail.success) {
      return res.json(responseQueries.error({ message: existMail.message }))
    }
    const insertLogin = await createSolitudLoginUser({ email: mail })
    if (insertLogin.success) {
      const insertClub = await pool.query(`
        INSERT INTO ${db}.club
        (id_user, name_club, date_founded, country, city, president, comet, contact, mail, social_networks, website, number_athletes, local_league, national_tournament, number_coaches, assistants, venues)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [insertLogin.data.insertId, name_club, date_founded, country, city, president, comet, contact, mail, JSON.stringify(social_networks), website, number_athletes, local_league, national_tournament, number_coaches, assistants, venues]);
      if (insertClub[0].affectedRows === 0) {
        return res.json(responseQueries.error({ message: "Registros no insertados" }))
      }
      const insertCatCorrect = await saveCategoriesClub(categories, insertClub[0].insertId);
      if (insertCatCorrect.error) {
        return res.json(responseQueries.error({ message: insertCatCorrect.message }))
      }
      const insertRole = await createRoleUser({ id_user: insertLogin.data.insertId, id_role: role.role_id })
      if (insertRole.error) {
        return res.json(responseQueries.error({ message: insertRole.message }))
      }
      const insertSolitudeRegister = await createSolitudeRegisterUser({ id_user: insertLogin.data.insertId, username: mail })
      if (insertSolitudeRegister.success) {
        const adminUser = await searchAdminAvailable();
        if (adminUser.error) {
          return res.json(responseQueries.error({ message: adminUser.message }))
        }
        let nameCompleteAdmin = `${adminUser.data[0].first_names.charAt(0).toUpperCase() + adminUser.data[0].first_names.slice(1)} ${adminUser.data[0].last_names.charAt(0).toUpperCase() + adminUser.data[0].last_names.slice(1)}`
        const loginAdmin = await searchLoginUserById({ id: adminUser.data[0].id_user })
        if (loginAdmin.error) {
          return res.json(responseQueries.error({ message: loginAdmin.message, status: loginAdmin.status, token: null, user: null }))
        }
        let nameComplete = `${name_club.charAt(0).toUpperCase() + name_club.slice(1)}`
        let username = mail;
        const tokenUsername = await generateToken({
          sub: loginAdmin.data[0].id_user,
          username: loginAdmin.data[0].username
        })
        const tokenPassword = await generateToken({
          sub: loginAdmin.data[0].id_user,
          password: loginAdmin.data[0].password
        })
        const tokenRole = await generateToken({
          sub: loginAdmin.data[0].id_user,
          role_user: role
        })
        const sendMailUserClub = await sendEmailFunction({ name: nameComplete, username: undefined, password: undefined, email: username, type: 'register_user_club', role_user: role.description_role })
        const sendMailAdmin = await sendEmailFunction({ name: { email: loginAdmin.data[0].username, name: nameCompleteAdmin, username: tokenUsername, password: tokenPassword, role_user: tokenRole }, username: nameComplete, password: undefined, email: username, type: 'register_admin', role_user: role.name_role })
        return res.json(responseQueries.success({
          message: "Registro exitoso",
          status: 200,
          data: [{ clubId: insertClub[0].insertId, loginId: insertLogin.data.insertId, solitudeId: insertSolitudeRegister.data.insertId, sendMailUserClub: sendMailUserClub, sendMailAdmin: sendMailAdmin }]
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

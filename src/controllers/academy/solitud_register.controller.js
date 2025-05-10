import { getClubByIdUserFunction, deleteClubByIdFunction } from "./club.controller.js";
import { getCoachByIdFunction, deleteCoachByIdFunction } from "./coach.controller.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { generateToken } from "../../utils/token/handle-token.js";
import { sendEmailFunction } from "../../lib/api/email.api.js";
import getConnection from "../../database/connection.mysql.js";


// Actualizar solicitud de registro
export async function updateSolitude(id) {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const update = await conn.query(`UPDATE ${db}.solitude_register SET verify = 1 WHERE id = ${id};`);
  if (!update) return responseQueries.error({ message: "Error update solitude" });
  return responseQueries.success({ message: "Success" });
}

// Eliminar solicitud de registro
export async function deleteSolitude(id) {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const update = await conn.query(`DELETE FROM ${db}.solitude_register WHERE id = ${id};`);
  if (!update) return responseQueries.error({ message: "Error delete solitude" });
  return responseQueries.success({ message: "Success" });
}

// Eliminar login usuario y contraseña default para athleta
export async function deleteLoginUser(id) {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const update = await conn.query(`DELETE FROM ${db}.login_users WHERE id_user = ${id};`);
  if (!update) return responseQueries.error({ message: "Error delete login user" });
  return responseQueries.success({ message: "Success" });
}

// Crear login usuario y contraseña default
export async function updateLoginUser(data) {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const update = await conn.query(`
    UPDATE ${db}.login_users SET password = '${data.password}', verified_at = ${data.verified_at} WHERE id_user = ${data.id_user};`);
  if (update[0].affectedRows === 0) {
    return responseQueries.error({ message: "Error update login user" });
  }
  return responseQueries.success({ message: "Success" });
}

// Aprobar solicitud de registro
export const approvedSolitude = async (req, res) => {
  const { id_solitude, id_user, role_user, nombre } = req.body;
  let user = {}
  const numberRandom = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const updateRegister = await updateSolitude(id_solitude);
  let searchUser = {};
  if (role_user == 'club') {
    searchUser = await getClubByIdUserFunction(id_user);
    if (searchUser.success && updateRegister.success && searchUser.data.length > 0) {
      user.email = searchUser.data[0].mail
      user.username = searchUser.data[0].mail;
      user.password = `${searchUser.data[0].president.charAt(0).toUpperCase() + searchUser.data[0].president.slice(1)}${numberRandom}*`
      user.id_user = id_user;
      user.verified_at = 'CURRENT_TIMESTAMP()';
      const updateLogin = await updateLoginUser(user);
      if (updateLogin.success) {
        const tokenUsername = await generateToken({
          sub: user.id_user,
          username: user.username
        })
        const tokenPassword = await generateToken({
          sub: user.id_user,
          password: user.password
        })
        const tokenRole = await generateToken({
          sub: user.id_user,
          role: role_user
        })
        const sendMail = await sendEmailFunction({ name: nombre, username: tokenUsername, password: tokenPassword, email: user.email, type: 'approved', role_user: tokenRole })
        const deleteRegister = await deleteSolitude(id_solitude);
        if (deleteRegister.error) {
          return res.json(responseQueries.error({ message: deleteRegister.message }));
        }
        return res.json(responseQueries.success({ message: "Success approvade", data: sendMail }));
      }
    } else {
      return res.json(responseQueries.error({ message: "User not found" }));
    }
  } else if (role_user == 'coach') {
    searchUser = await getCoachByIdFunction(id_user);
    if (searchUser.success && updateRegister.success && searchUser.data.length > 0) {
      user.email = searchUser.data[0].mail
      user.username = searchUser.data[0].mail;
      user.password = `${searchUser.data[0].last_names.charAt(0).toUpperCase() + searchUser.data[0].last_names.slice(1)}${numberRandom}*`
      user.id_user = id_user;
      user.verified_at = 'NULL';
      const updateLogin = await updateLoginUser(user);
      if (updateLogin.success) {
        const tokenUsername = await generateToken({
          sub: user.id_user,
          username: user.username
        })
        const tokenPassword = await generateToken({
          sub: user.id_user,
          password: user.password
        })
        const tokenRole = await generateToken({
          sub: user.id_user,
          role: role_user
        })
        const sendMail = await sendEmailFunction({ name: nombre, username: tokenUsername, password: tokenPassword, email: user.email, type: 'approved', role_user: tokenRole })
        const deleteRegister = await deleteSolitude(id_solitude);
        if (deleteRegister.error) {
          return res.json(responseQueries.error({ message: deleteRegister.message }));
        }
        return res.json(responseQueries.success({ message: "Success approvade", data: sendMail }));
      }
    } else {
      return res.json(responseQueries.error({ message: "User not found" }));
    }
  }
}

// Denegar solicitud de registro
export const deniedSolitude = async (req, res) => {
  const { id_solitude, id_user, role_user, nombre } = req.body;
  if (role_user == 'club') {
    const deleteRegister = await deleteSolitude(id_solitude);
    if (deleteRegister.error) {
      return res.json(responseQueries.error({ message: deleteRegister.message }));
    }
    const searchUser = await getClubByIdUserFunction(id_user);
    if (searchUser.error) {
      return res.json(responseQueries.error({ message: searchUser.message }));
    }
    const deleteLogin = await deleteLoginUser(id_user);
    const deleteUser = await deleteClubByIdFunction(id_user);
    if (deleteLogin.success && deleteUser.success) {
      const sendMail = await sendEmailFunction({ name: nombre, email: searchUser.data[0].mail, type: 'denied', role_user: role_user })
      return res.json(responseQueries.success({ message: "Success denied", data: sendMail }));
    } else {
      return res.json(responseQueries.error({ message: { deleteLogin: deleteLogin.message, deleteUser: deleteUser.message } }));
    }
  }
  if (role_user == 'coach') {
    const deleteRegister = await deleteSolitude(id_solitude);
    if (deleteRegister.error) {
      return res.json(responseQueries.error({ message: deleteRegister.message }));
    }
    const searchUser = await getCoachByIdFunction(id_user);
    if (searchUser.error) {
      return res.json(responseQueries.error({ message: searchUser.message }));
    }
    const deleteLogin = await deleteLoginUser(id_user);
    const deleteUser = await deleteCoachByIdFunction(id_user);
    if (deleteLogin.success && deleteUser.success) {
      const sendMail = await sendEmailFunction({ name: nombre, email: searchUser.data[0].mail, type: 'denied', role_user: role_user })
      return res.json(responseQueries.success({ message: "Success denied", data: sendMail }));
    } else {
      return res.json(responseQueries.error({ message: { deleteLogin: deleteLogin.message, deleteUser: deleteUser.message } }));
    }
  }
}

//Obtener todas las solicitudes de registro de entrenadores
export const getSolitudeUsersCoach = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`
    SELECT sr.id id_solitude, cu.id_club, cu.id_user, ru.id_role, rs.name_role role_user,
    CONCAT(IFNULL(cu.first_names, ''), ' ', IFNULL(cu.last_names, '')) AS nombre, lu.username, sr.verify
    FROM ${db}.coach cu
    INNER JOIN ${db}.login_users lu ON lu.id_user = cu.id_user
    INNER JOIN ${db}.solitude_register sr ON sr.id_user = lu.id_user
  	INNER JOIN ${db}.role_user ru ON ru.id_user = sr.id_user
    INNER JOIN ${db}.role_system rs ON ru.id_role = rs.id
    WHERE sr.verify = 0 and rs.id = 2;
  `);
  if (!select) return res.json(responseQueries.error({ message: "Error query get solitude users" }));
  return res.json(responseQueries.success({ message: "Success", data: select[0] }));
}

//Obtener todas las solicitudes de registro de clubes
export const getSolitudeUsersClub = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`
    SELECT sr.id id_solitude, cu.id_user, ru.id_role, rs.name_role role_user,
    cu.name_club AS nombre, cu.president, lu.username, sr.verify
    FROM ${db}.club cu
    INNER JOIN ${db}.login_users lu ON lu.id_user = cu.id_user
    INNER JOIN ${db}.solitude_register sr ON sr.id_user = lu.id_user
  	INNER JOIN ${db}.role_user ru ON ru.id_user = sr.id_user
    INNER JOIN ${db}.role_system rs ON ru.id_role = rs.id
    WHERE sr.verify = 0 and rs.id = 1;
  `);
  if (!select) return res.json(responseQueries.error({ message: "Error query get solitude users" }));
  return res.json(responseQueries.success({ message: "Success", data: select[0] }));
}

//Obtener todas las categorias para el registro
export const getCategoriesForRegister = async (req, res) => {
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`
    SELECT * FROM ${db}.sub_categories
  `);
  if (!select) return res.json(responseQueries.error({ message: "Error query get categories users" }));
  return res.json(responseQueries.success({ message: "Success", data: select[0] }));
}

export async function saveCategoriesForRegisterFunction(data) {
  const { id_sub_category, id_user } = req.body;
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`
    INSERT INTO ${db}.categories_athlete
    (id, id_athlete, id_category)
    VALUES(?, ?, ?);
  `, [id_sub_category, id_user]);
  if (!select) return res.json(responseQueries.error({ message: "Error query save categories users" }));
  return res.json(responseQueries.success({ message: "Success", data: select[0] }));
}

export async function saveCategoriesAvailablesClubFunction(data) {
  const { id_sub_category, id_club } = data;
  const conn = await getConnection();
  const db = variablesDB.academy;
  const select = await conn.query(`
    INSERT INTO ${db}.categories_club_available
    (id_club, id_category)
    VALUES(?, ?);
  `, [id_club, id_sub_category]);
  if (!select) return responseQueries.error({ message: "Error query save solitude users" });
  return responseQueries.success({ message: "Success", data: select[0] });
}
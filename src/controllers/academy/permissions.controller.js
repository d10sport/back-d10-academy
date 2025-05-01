import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { variablesDB } from "../../utils/params/const.database.js";
import getConnection from "../../database/connection.mysql.js";

// Obtener todos los permisos de usuario por rol
export const getAllPermissionsAndRole = async (req, res) => {
  const pool = await getConnection()
  const db = variablesDB.academy
  try {
    const response = await pool.query(`SELECT
        r.id AS role_id,
        r.name_role AS role_name,
        p.id AS permission_id,
        p.name_permission AS permission_name,
        p.description_permission,
        p.link
      FROM ${db}.role_permissions rp
      JOIN ${db}.role_system r ON rp.id_role = r.id
      JOIN ${db}.permissions p ON rp.id_permission = p.id
      ORDER BY r.id, p.id;`)
    if (response[0].length === 0) {
      return res.json(responseQueries.error({
        message: "Error query permissions by roles",
        data: response[0]
      }));
    }
    return res.json(responseQueries.success({
      message: "Success query permissions by roles",
      data: response[0]
    }));
  } catch (error) {
    return res.json(responseQueries.error({
      message: "Error query permissions by roles",
      error
    }));
  }
}

// Obtener permiso de usuario por rol
export async function getPermissionsByIdUserFunction(id) {
  const pool = await getConnection()
  const db = variablesDB.academy
  try {
    const response = await pool.query(`SELECT
      p.id id_permission, p.name_permission, p.description_permission, rs.name_role, p.link
      FROM ${db}.role_user ru
      JOIN ${db}.role_permissions rp ON ru.id_role = rp.id_role
      JOIN ${db}.permissions p ON rp.id_permission = p.id
      JOIN ${db}.role_system rs ON ru.id_role = rs.id
      WHERE ru.id_user = ?;`, [id])
    if (response[0].length === 0) {
      return responseQueries.error({
        message: "Error query permissions by roles",
        data: response[0]
      });
    }
    return responseQueries.success({
      message: "Success query permissions by roles",
      data: response[0]
    });
  } catch (error) {
    return responseQueries.error({
      message: "Error query permissions by roles",
      error
    });
  }
}

// Obtener permiso de usuario por rol
export const getPermissionsByIdUser = async (req, res) => {
  const id = req.params.id_user
  const pool = await getConnection()
  const db = variablesDB.academy
  try {
    const response = await pool.query(`SELECT
      p.id id_permission, p.name_permission, p.description_permission, rs.name_role, p.link
      FROM ${db}.role_user ru
      JOIN ${db}.role_permissions rp ON ru.id_role = rp.id_role
      JOIN ${db}.permissions p ON rp.id_permission = p.id
      JOIN ${db}.role_system rs ON ru.id_role = rs.id
      WHERE ru.id_user = ?;`, [id])
    if (response[0].length === 0) {
      return res.json(responseQueries.error({
        message: "Error query permissions by roles",
        data: response[0]
      }));
    }
    return res.jsob(responseQueries.success({
      message: "Success query permissions by roles",
      data: response[0]
    }));
  } catch (error) {
    return res.json(responseQueries.error({
      message: "Error query permissions by roles",
      error
    }));
  }
}


// Obtener rol de usuario por rol Admin
export const getPermissionsByRoleAdmin = async (req, res) => {
  const pool = await getConnection()
  const db = variablesDB.academy
  try {
    const response = await pool.query(`SELECT
        p.id AS permission_id,
        p.name_permission AS permission_name
      FROM ${db}.role_permissions rp
      JOIN ${db}.permissions p ON rp.id_permission = p.id
      WHERE rp.id_role = 4;`)
    if (response[0].length === 0) {
      return res.json(responseQueries.error({
        message: "Error query permissions by roles",
        data: response[0]
      }));
    }
    return res.json(responseQueries.success({
      message: "Success query permissions by roles",
      data: response[0]
    }));
  } catch (error) {
    return res.json(responseQueries.error({
      message: "Error query permissions by roles",
      error
    }));
  }
}

// Obtener rol de usuario por rol
export async function getPermissionsByRoleFunction(id) {
  const pool = await getConnection()
  const db = variablesDB.academy
  try {
    const response = await pool.query(`SELECT
        p.id AS permission_id,
        p.name_permission AS permission_name
      FROM ${db}.role_permissions rp
      JOIN ${db}.permissions p ON rp.id_permission = p.id
      WHERE rp.id_role = ?;`, [id])
    if (response[0].length === 0) {
      return responseQueries.error({
        message: "Error query permissions by roles",
        data: response[0]
      });
    }
    return responseQueries.success({
      message: "Success query permissions by roles",
      data: response[0]
    });
  } catch (error) {
    return responseQueries.error({
      message: "Error query permissions by roles",
      error
    });
  }
}

// Obtener rol de usuario por rol
export const getPermissionsByRoleUser = async (req, res) => {
  const id = req.params.role_id
  const pool = await getConnection()
  const db = variablesDB.academy
  try {
    const response = await pool.query(`SELECT
        p.id AS permission_id,
        p.name_permission AS permission_name
      FROM ${db}.role_permissions rp
      JOIN ${db}.permissions p ON rp.id_permission = p.id
      WHERE rp.id_role = ?;`, [id])
    if (response[0].length === 0) {
      return res.json(responseQueries.error({
        message: "Error query permissions by roles",
        data: response[0]
      }));
    }
    return res.json(responseQueries.success({
      message: "Success query permissions by roles",
      data: response[0]
    }));
  } catch (error) {
    return res.json(responseQueries.error({
      message: "Error query permissions by roles",
      error
    }));
  }
}
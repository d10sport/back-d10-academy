import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { variablesDB } from "../../utils/params/const.database.js";
import getConnection from "../../database/connection.mysql.js";

// Obtener todos los roles del sistema
export const getAllRoles = async (req, res) => {
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`SELECT * FROM ${db}.role_system;`)
        if (response[0].length === 0) {
            return responseQueries.error({
                message: "Error query roles",
                data: response[0]
            });
        }
        return res.json(responseQueries.success({
            message: "Success query",
            data: response[0]
        }))
    } catch (error) {
        return responseQueries.error({
            message: "Error query roles",
            error
        });
    }
}

// Function para todos los roles del sistema
export async function getAllRolesFunction() {
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`SELECT * FROM ${db}.role_system;`)
        if (response[0].length === 0) {
            return responseQueries.error({
                message: "Error query roles",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success query",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: "Error query roles",
            error
        });
    }
}

// Obtener rol de usuario
export const getRoleUserByIdUser = async (req, res) => {
    const id = req.params.id_user;
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`SELECT rs.name_role, ru.id_role FROM ${db}.role_user ru
        INNER JOIN ${db}.role_system rs ON ru.id_role = rs.id
        WHERE ru.id_user = ?;`, [id])
        if (response[0].length === 0) {
            return res.json(responseQueries.error({
                message: "Error query role user",
                data: response[0]
            }));
        }
        return res.json(responseQueries.success({
            message: "Success query",
            data: response[0]
        }));
    } catch (error) {
        return res.json(responseQueries.error({
            message: "Error query role user",
            error
        }));
    }
}

// Obtener rol de usuario
export async function getRoleUser(id) {
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`SELECT rs.name_role, ru.id_role FROM ${db}.role_user ru
        INNER JOIN ${db}.role_system rs ON ru.id_role = rs.id
        WHERE ru.id_user = ?;`, [id])
        if (response[0].length === 0) {
            return responseQueries.error({
                message: "Error query role user",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success query",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: "Error query role user",
            error
        });
    }
}


// Obtener información de rol por id
export async function getRoleByIdRole(id) {
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`SELECT rs.id, rs.name_role, rs.description_role FROM ${db}.role_system rs where rs.id = '${id}';`)
        if (response[0].length === 0) {
            return responseQueries.error({
                message: "Error query id role",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success query",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: "Error query id role",
            error
        });
    }
}

// Obtener id de rol
export async function getIdRole(role) {
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`SELECT rs.id, rs.description_role FROM ${db}.role_system rs where rs.name_role = '${role}';`)
        if (response[0].length === 0) {
            return responseQueries.error({
                message: "Error query id role",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success query",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: "Error query id role",
            error
        });
    }
}

// Insertar rol de usuario
export async function createRoleUser(data) {
    const { id_user, id_role } = data
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`INSERT INTO ${db}.role_user
        (id_user, id_role) VALUES(?, ?);`, [id_user, id_role])
        if (response[0].affectedRows === 0) {
            return responseQueries.error({
                message: "Error insert",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success insert",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: "Error insert",
            error
        });
    }
}

// Obtener rol de usuario admin
export async function getRoleAdmin() {
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`SELECT ru.id_user, ru.id_role FROM ${db}.role_user ru
        INNER JOIN ${db}.admin_user au ON au.id_user = ru.id_user;`, [id])
        if (response[0].length === 0) {
            return responseQueries.error({
                message: "Error query role user",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success query",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: "Error query role user",
            error
        });
    }
}
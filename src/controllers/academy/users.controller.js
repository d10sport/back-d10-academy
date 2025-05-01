import { getClubByIdFunction, getClubByIdUserFunction } from "./club.controller.js";
import { hashPassword, verifyPassword } from "../../utils/auth/handle-password.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import { getPermissionsByIdUserFunction } from "./permissions.controller.js";
import { getRoleUser, getAllRolesFunction } from "./role.controller.js";
import { getAdminByIdUserFunction } from "../admin/admin.controller.js";
import { responseJWT } from "../../common/enum/jwt/response.jwt.js";
import { variablesDB } from "../../utils/params/const.database.js";
import { generateToken } from "../../utils/token/handle-token.js";
import { getAthleteByIdFunction } from "./athletes.controller.js";
import getConnection from "../../database/connection.mysql.js";
import { getCoachByIdFunction } from "./coach.controller.js";

// Buscar usuario por id
export async function searchLoginUserById(data) {
    const { id } = data
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`SELECT id_user, username, email, password, verify, created_at, verified_at FROM ${db}.login_users WHERE id_user = ?`, [id])
        if (response[0].length === 0) {
            return responseQueries.error({
                message: "User not found",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success query",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: "Error query search user",
            error
        });
    }
}

//Buscar usuario por email
export async function searchUserLogin(data) {
    const { username } = data
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(
            `SELECT id_user, username, password, email, verify, created_at, verified_at FROM
            ${db}.login_users WHERE username = ? AND verified_at IS NULL
            OR email = ? AND verified_at IS NOT NULL`,
            [username, username]
        );
        if (response[0].length === 0) {
            return responseQueries.error({
                message: "User not found",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success query",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: "Error query search user",
            error
        });
    }
}

// Actualizar password del usuario y validación de actualización de contraseña
export async function updatePasswordHashUser(data) {
    const { id, password, verify } = data
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`UPDATE ${db}.login_users SET password=?, verify=?, verified_at=CURRENT_TIMESTAMP() WHERE id_user=?`, [password, verify, id])
        if (response[0].affectedRows === 0) {
            return responseQueries.error({
                message: "Error update password",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success update",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: "Error update password",
            error
        });
    }
}

// Actualizar solo password del usuario
export async function updateOnlyPasswordHashUser(data) {
    const { id, password } = data
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`UPDATE ${db}.login_users SET password=? WHERE id_user=?`, [password, id])
        if (response[0].affectedRows === 0) {
            return responseQueries.error({
                message: "Error update password",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success update",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: "Error update password",
            error
        });
    }
}

// Obtener datos del usuario por id y rol
async function getDataUser(data) {
    const { id_user, role_user } = data
    try {
        let user = {}
        const roles = await getAllRolesFunction();
        if (roles.error) {
            return responseQueries.error({
                message: "Error query roles",
                error: roles.error
            });
        }
        const roleFilter = roles.data.filter(role => role.name_role === role_user)
        if (roleFilter.length === 0) {
            return responseQueries.error({
                message: "Error query roles",
                error: "Role not found"
            });
        }
        if (roleFilter[0].name_role == 'athlete') {
            const responseAthlete = await getAthleteByIdFunction(id_user)
            if (responseAthlete.error) {
                return responseQueries.error({
                    message: "Error query athlete",
                    error: responseAthlete.error
                });
            }
            user = responseAthlete.data[0]
        }
        else if (roleFilter[0].name_role == 'coach') {
            const responseCoach = await getCoachByIdFunction(id_user)
            const responseClub = await getClubByIdFunction(responseCoach.data[0].id_club)
            if (responseClub.error || responseCoach.error) {
                return responseQueries.error({
                    message: "Error query coach",
                    error: responseClub.error || responseCoach.error
                });
            }
            user = responseCoach.data[0]
            user.club = responseClub.data[0]
            delete user.id_club
        }
        else if (roleFilter[0].name_role == 'club') {
            const responseClub = await getClubByIdUserFunction(id_user)
            if (responseClub.error) {
                return responseQueries.error({
                    message: "Error query club",
                    error: responseClub.error
                });
            }
            user = responseClub.data[0]
        }
        else if (roleFilter[0].name_role == 'admin') {
            const responseAdmin = await getAdminByIdUserFunction(id_user)
            if (responseAdmin.error) {
                return responseQueries.error({
                    message: "Error query admin",
                    error: responseAdmin.error
                });
            }
            user = responseAdmin.data[0]
        } else {
            return responseQueries.error({
                message: "Role not found",
                error: "Role not found"
            });
        }
        return responseQueries.success({
            message: "Success query",
            data: user
        });
    } catch (error) {
        return responseQueries.error({
            message: "Error query user",
            error
        });
    }
}


// Validar si el usuario existe para logearse
export const validLoginUsersAcademy = async (req, res) => {
    const userExist = await searchUserLogin({ username: req.body.username })
    if (userExist.error) {
        res.json(responseJWT.error({ message: userExist.message, status: userExist.status, token: null, user: null }))
        return
    }
    const { id_user, username, email, password, verify } = userExist.data[0]
    const role = await getRoleUser(id_user);
    if (role.error) {
        res.json(responseJWT.error({ message: role.message, status: role.status, token: null, user: null }))
        return
    }
    if (role.data[0].id_role !== req.body.role_user.role_id) {
        res.json(responseJWT.error({ message: 'Role invalido', status: 200, token: null, user: null }))
        return
    }
    if (userExist.success) {
        if (verify === 0) {
            const isPassword = await verifyPassword(req.body.password, password)
            if (req.body.password == password) {
                const passwordHash = await hashPassword({ id: id_user, username: username, email: email, password: password })
                const updatePassword = await updateOnlyPasswordHashUser({ id: id_user, password: passwordHash.password })
                if (updatePassword.success) {
                    const dataUser = await getDataUser({ id_user: id_user, role_user: req.body.role_user.description_role })
                    if (dataUser.error) {
                        return res.json(responseJWT.error({ message: dataUser.message, status: dataUser.status, token: null, user: null }))
                    }
                    const permission = await getPermissionsByIdUserFunction(id_user);
                    if (permission.error) {
                        return res.json(responseJWT.error({ message: permission.message, status: permission.status, token: null, user: null }))
                    }
                    const user = {
                        id_login: id_user,
                        username: username,
                        email: email,
                        role: role.data[0].name_role,
                        id_role: role.data[0].id_role,
                        permissions: permission.data,
                        ...dataUser.data
                    }
                    const payload = {
                        sub: id_user,
                        user: user
                    }
                    const token = await generateToken(payload, '3h')
                    return res.json(responseJWT.success({ message: 'Acceso exitoso', token }))
                } else {
                    return res.json(responseJWT.error({ message: updatePassword.message, status: updatePassword.status, token: null, user: null }))
                }
            } else if (isPassword) {
                const dataUser = await getDataUser({ id_user: id_user, role_user: req.body.role_user.description_role })
                if (dataUser.error) {
                    return res.json(responseJWT.error({ message: dataUser.message, status: dataUser.status, token: null, user: null }))
                }
                const permission = await getPermissionsByIdUserFunction(id_user);
                if (permission.error) {
                    return res.json(responseJWT.error({ message: permission.message, status: permission.status, token: null, user: null }))
                }
                const user = {
                    id_login: id_user,
                    username: username,
                    email: email,
                    role: role.data[0].name_role,
                    id_role: role.data[0].id_role,
                    permissions: permission.data,
                    ...dataUser.data
                }
                const payload = {
                    sub: id_user,
                    user: user
                }
                const token = await generateToken(payload, '3h')
                return res.json(responseJWT.success({ message: 'Acceso exitoso', token }))
            } else {
                return res.json(responseJWT.error({ message: 'Contraseña o nombre de usuario no válidos', status: 200, token: null, user: null }))
            }
        }
        else {
            const isPassword = await verifyPassword(req.body.password, password)
            if (isPassword) {
                const dataUser = await getDataUser({ id_user: id_user, role_user: req.body.role_user.description_role })
                if (dataUser.error) {
                    return res.json(responseJWT.error({ message: dataUser.message, status: dataUser.status, token: null, user: null }))
                }
                const permission = await getPermissionsByIdUserFunction(id_user);
                if (permission.error) {
                    return res.json(responseJWT.error({ message: permission.message, status: permission.status, token: null, user: null }))
                }
                const user = {
                    id_login: id_user,
                    username: username,
                    email: email,
                    role: role.data[0].name_role,
                    id_role: role.data[0].id_role,
                    permissions: permission.data,
                    ...dataUser.data
                }
                const payload = {
                    sub: id_user,
                    user: user
                }
                const token = await generateToken(payload, '3h')
                return res.json(responseJWT.success({ message: 'Acceso exitoso', token }))
            } else {
                return res.json(responseJWT.error({ message: 'Contraseña o nombre de usuario no válidos', status: 200, token: null, user: null }))
            }
        }
    } else {
        return res.json(responseJWT.error({ message: 'Contraseña o nombre de usuario no válidos', status: 200, token: null, user: null }))
    }
}

//Crear solicitud de registro de usuario
export async function createSolitudeRegisterUser(data) {
    const { id_user, username } = data
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`INSERT INTO ${db}.solitude_register
            (id_user, username, email, verify)  VALUES(?, ?, ?, ?)`,
            [id_user, username, username, 0])
        if (response[0].affectedRows === 0) {
            return responseQueries.error({
                message: error?.message ?? "Error insert register",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success insert",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: error?.message ?? "Error insert register",
            error
        });
    }
}

//Crear solicitud login de usuario
export async function createSolitudLoginUser(data) {
    const { email } = data
    const pool = await getConnection()
    const db = variablesDB.academy
    try {
        const response = await pool.query(`INSERT INTO ${db}.login_users
            (username, password, email, verify, created_at, verified_at)
            VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP(), NULL)`,
            [email, 'password', email, 0])
        if (response[0].affectedRows === 0) {
            return responseQueries.error({
                message: error?.message ?? "Error insert login",
                data: response[0]
            });
        }
        return responseQueries.success({
            message: "Success insert",
            data: response[0]
        });
    } catch (error) {
        return responseQueries.error({
            message: error?.message ?? "Error insert login",
            error
        });
    }
}

// Buscar correos ya registrados
export async function validateNotRegisterMail(mail) {
    const conn = await getConnection();
    const db = variablesDB.academy;
    const [rows] = await conn.query(`SELECT * FROM ${db}.login_users WHERE email = '${mail}';`);
    if (rows.length > 0) return responseQueries.success({ message: "User already exists" });
    return responseQueries.error({ message: "Mail not exists" });
}
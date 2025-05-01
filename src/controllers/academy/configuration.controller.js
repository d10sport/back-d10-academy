import { updatePasswordHashUser, searchLoginUserById } from './users.controller.js'
import { hashPassword, verifyPassword } from '../../utils/auth/handle-password.js'
import { responseQueries } from '../../common/enum/queries/response.queries.js'
import { variablesDB } from '../../utils/params/const.database.js'
import getConnection from '../../database/connection.mysql.js'

export const getUserInfo = async (req, res) => {
    const conn = await getConnection()
    const db = variablesDB.academy
    const { id_user } = req.params
    const select = await conn.query(`SELECT * FROM ${db}.login_users WHERE id_user = ?;`, [id_user])
    if (!select) return res.json(responseQueries.error({ message: 'Error obteniendo el usuario' }))
    return res.json(responseQueries.success({ data: select[0] }))
}

// export const updateUserInfoById = async (req, res) => {
//     const { id_user, first_name, last_name, user_name, address, city, role_id, church, id } = req.body
//     pool.query("UPDATE user_info SET id_user=?, first_name=?, last_name=?, user_name=?, address=?, city=?, role_id=?, church=? WHERE id=?", [id_user, first_name, last_name, user_name, address, city, role_id, church, id], async (err, result) => {
//         if (err) {
//             res.send({ message: "Error en el actualizado", error: err })
//             return
//         }
//         pool.query("UPDATE user_login SET username=? WHERE id=?", [user_name, id], async (err, result) => {
//             if (err) {
//                 res.send({ message: "Error en el actualizado", error: err })
//                 return
//             }
//             res.send({ usuario: result })
//         })
//     })
// }

// Función para generar un código de verificación de correo a partir del token hash
// export async function generativeCodeVerification(tokenHash) {
//     const codeVerify = bcrypt.hashSync(tokenHash, 8)
//     return codeVerify.slice(0, 8)
// }

// export const updatePasswordSolitudeUserById = async (req, res) => {
//     const { passwordOld, email } = req.body
//     //Generar código de verificación de correo a partir del token hash
//     const code = await generativeCodeVerification(passwordOld)
//     try {
//         //Enviar correo de solicitud cambio contraseña
//         const result = await sendEmailSolitudeChangePassword(code, email)
//         res.send({ "message": "Solicitud enviada", "code": code, "result": result })
//     } catch (error) {
//         res.status(500).send({ "Error envio correo": error })
//         return
//     }
// }

export const updateUserLoginById = async (req, res) => {
    const { user_id, username, passwordNew, passwordOld, verify } = req.body
    const userExist = await searchLoginUserById({ id: user_id })
    if (userExist.error) {
        res.json(responseQueries.error({ message: userExist.message, status: userExist.status, token: null, user: null }))
        return
    }
    const verifyPasswordOld = await verifyPassword(passwordOld, userExist.data[0].password);
    if (!verifyPasswordOld && userExist.data[0].password !== passwordOld) {
        return res.status(400).json(responseQueries.success({ message: "Contraseña incorrecta" }))
    }
    const passwordHash = await hashPassword({ id: user_id, username: username, email: username, password: passwordNew })
    const updatePassword = await updatePasswordHashUser({ id: user_id, password: passwordHash.password, verify: !verify })
    if (!updatePassword) {
        return res.status(400).json(responseQueries.success({ message: "Error al actualizar la contraseña" }))
    }
    return res.status(200).json(responseQueries.success({ message: "Contraseña actualizada correctamente" }))
}